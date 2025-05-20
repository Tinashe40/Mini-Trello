package com.tinashe.projectservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tinashe.projectservice.entity.Project;
import com.tinashe.projectservice.exception.ResourceNotFoundException;
import com.tinashe.projectservice.repository.ProjectRepository;


@Service

@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {  

    private final ProjectRepository projectRepository;
    public ProjectServiceImpl(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Override
    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}