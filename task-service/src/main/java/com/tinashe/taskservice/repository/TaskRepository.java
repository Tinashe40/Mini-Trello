package com.tinashe.taskservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tinashe.taskservice.entity.Task;
import com.tinashe.taskservice.enums.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);
    List<Task> findByAssigneeId(Long assigneeId);
}