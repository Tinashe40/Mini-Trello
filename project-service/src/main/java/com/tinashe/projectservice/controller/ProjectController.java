package com.tinashe.projectservice.controller;

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

import com.tinashe.projectservice.entity.Project;
import com.tinashe.projectservice.enums.ProjectStatus;
import com.tinashe.projectservice.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "Manage projects and their lifecycle")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new project (Admin only)")
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
            @RequestHeader("Authorization") String token) {
        Project savedProject = projectService.createProject(project, token);
        return ResponseEntity.created(URI.create("/api/projects/" + savedProject.getId()))
                .body(savedProject);
    }

    @PatchMapping("/{projectId}/status")
    @Operation(summary = "Update project status")
    public ResponseEntity<Project> updateStatus(
            @PathVariable Long projectId,
            @RequestParam ProjectStatus status) {
        return ResponseEntity.ok(projectService.updateProjectStatus(projectId, status));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project (Admin only)")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get project details")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get projects by user")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getUserProjects(userId));
    }
}