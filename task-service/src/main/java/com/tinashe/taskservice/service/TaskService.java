package com.tinashe.taskservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tinashe.taskservice.entity.Task;
import com.tinashe.taskservice.exception.ResourceNotFoundException;
import com.tinashe.taskservice.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectServiceClient projectServiceClient;
    private final UserServiceClient userServiceClient;

    public Task createTask(Long projectId, Task task) {
        // Verify project exists
        projectServiceClient.getProjectById(projectId);
        
        task.setProjectId(projectId);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setAssigneeId(taskDetails.getAssigneeId());
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }
}