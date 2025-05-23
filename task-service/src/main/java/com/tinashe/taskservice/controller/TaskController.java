package com.tinashe.taskservice.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tinashe.taskservice.entity.Task;
import com.tinashe.taskservice.enums.TaskStatus;
import com.tinashe.taskservice.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "Endpoints for managing tasks within projects")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Get all tasks for a project")
    @GetMapping
    public ResponseEntity<List<Task>> getProjectTasks(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @Operation(summary = "Get tasks by status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(
            @PathVariable Long projectId,
            @PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByProjectAndStatus(projectId, status));
    }

    @Operation(summary = "Create task (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(
            @PathVariable Long projectId,
            @RequestBody Task task,
            @RequestHeader("Authorization") String authToken) {
        Task savedTask = taskService.createTask(projectId, task, authToken);
        return ResponseEntity.created(URI.create("/api/projects/" + projectId + "/tasks/" + savedTask.getId()))
                .body(savedTask);
    }

    @Operation(summary = "Update task status")
    @PatchMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @Operation(summary = "Cancel task (Admin only)")
    @PostMapping("/{taskId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Task> cancelTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, TaskStatus.CANCELLED));
    }

    @Operation(summary = "Delete task (Admin only)")
    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get task details")
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @Operation(summary = "Get user's tasks")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getUserTasks(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getUserTasks(userId));
    }
}