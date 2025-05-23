package com.tinashe.taskservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tinashe.taskservice.entity.Task;
import com.tinashe.taskservice.enums.TaskStatus;
import com.tinashe.taskservice.exception.InsufficientPrivilegesException;
import com.tinashe.taskservice.exception.ResourceNotFoundException;
import com.tinashe.taskservice.feignclients.ProjectServiceClient;
import com.tinashe.taskservice.feignclients.UserServiceClient;
import com.tinashe.taskservice.models.User;
import com.tinashe.taskservice.repository.TaskRepository;
import com.tinashe.taskservice.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectServiceClient projectServiceClient;
    private final UserServiceClient userServiceClient;
    private final SecurityUtils securityUtils;

    public Task createTask(Long projectId, Task task, String authToken) {
        if (!securityUtils.isAdmin()) {
            throw new InsufficientPrivilegesException("Only admins can create tasks");
        }

        // Verify project exists
        projectServiceClient.getProjectById(projectId, authToken);
        
        // Verify assignee exists
        User assignee = userServiceClient.getUserById(task.getAssigneeId(), authToken);
        if (assignee == null) {
            throw new ResourceNotFoundException("User not found with id: " + task.getAssigneeId());
        }

        task.setProjectId(projectId);
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedBy(securityUtils.getCurrentUserId());
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus newStatus) {
        Task task = getTaskById(taskId);
        
        if (!securityUtils.isAdmin()) {
            // Users can only update their own tasks
            if (!task.getAssigneeId().equals(securityUtils.getCurrentUserId())) {
                throw new InsufficientPrivilegesException("You can only update tasks assigned to you");
            }
            
            // Users can only move from PENDING to IN_PROGRESS to COMPLETED
            if (!isValidUserStatusTransition(task.getStatus(), newStatus)) {
                throw new IllegalArgumentException("Invalid status transition");
            }
        } else {
            // Admins can cancel tasks
            if (newStatus == TaskStatus.CANCELLED && task.getStatus() != TaskStatus.PENDING) {
                throw new IllegalArgumentException("Only PENDING tasks can be cancelled");
            }
        }
        
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }

    private boolean isValidUserStatusTransition(TaskStatus current, TaskStatus newStatus) {
        return (current == TaskStatus.PENDING && newStatus == TaskStatus.IN_PROGRESS) ||
               (current == TaskStatus.IN_PROGRESS && newStatus == TaskStatus.COMPLETED);
    }

    public void deleteTask(Long taskId) {
        if (!securityUtils.isAdmin()) {
            throw new InsufficientPrivilegesException("Only admins can delete tasks");
        }
        Task task = getTaskById(taskId);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByProjectAndStatus(Long projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }

    @Transactional(readOnly = true)
    public List<Task> getUserTasks(Long userId) {
        return taskRepository.findByAssigneeId(userId);
    }
}