package com.tinashe.projectservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tinashe.projectservice.FeignClients.UserServiceClient;
import com.tinashe.projectservice.entity.Project;
import com.tinashe.projectservice.enums.ProjectStatus;
import com.tinashe.projectservice.exception.ProjectNotFoundException;
import com.tinashe.projectservice.exception.UnauthorizedAccessException;
import com.tinashe.projectservice.repository.ProjectRepository;
import com.tinashe.projectservice.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

/**
 * Service layer for managing projects.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SecurityUtils securityUtils;
    private final UserServiceClient userServiceClient;

    /**
     * Create a new project with default status PLANNING.
     */
    public Project createProject(Project project, String authToken) {
        // Verify user exists before creating the project
        userServiceClient.getUserById(project.getCreatedBy(), authToken);
        project.setStatus(ProjectStatus.PLANNING);
        return projectRepository.save(project);
    }

    /**
     * Update the status of a project if user is admin or project owner.
     */
    public Project updateProjectStatus(Long projectId, ProjectStatus newStatus) {
        Project project = getProjectById(projectId);
        Long currentUserId = securityUtils.getCurrentUserId();

        if (!securityUtils.isAdmin() && !project.getCreatedBy().equals(currentUserId)) {
            throw new UnauthorizedAccessException("Only project owners or admins can update status");
        }

        project.setStatus(newStatus);
        return projectRepository.save(project);
    }

    /**
     * Delete a project (admin only).
     */
    public void deleteProject(Long projectId) {
        if (!securityUtils.isAdmin()) {
            throw new UnauthorizedAccessException("Only admins can delete projects");
        }
        Project project = getProjectById(projectId);
        projectRepository.delete(project);
    }

    /**
     * Get a project by its ID.
     */
    @Transactional(readOnly = true)
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with ID: " + projectId));
    }

    /**
     * Get all projects created by a specific user.
     */
    @Transactional(readOnly = true)
    public List<Project> getUserProjects(Long userId) {
        return projectRepository.findByCreatedBy(userId);
    }
}
