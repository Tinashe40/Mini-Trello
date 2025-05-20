package com.tinashe.projectservice.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tinashe.projectservice.entity.Project;
import com.tinashe.projectservice.repository.ProjectRepository;
import com.tinashe.projectservice.service.ProjectServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "Manage projects and their details")

public class ProjectController {

    private final ProjectServiceImpl projectService;
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectController(ProjectServiceImpl projectService, ProjectRepository projectRepository) {
        this.projectService = projectService;
        this.projectRepository = projectRepository;
    }

    @Operation(summary = "Get all projects")
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @Operation(summary = "Get project by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @Operation(summary = "Create new project")
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectService.createProject(project);
        return ResponseEntity.created(URI.create("/projects/" + savedProject.getId()))
                .body(savedProject);
    }

    @Operation(summary = "Update existing project")
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id, 
            @RequestBody Project projectDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDetails));
    }

    @Operation(summary = "Delete project")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}