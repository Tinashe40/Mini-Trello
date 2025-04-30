package com.tinashe.projectservice.repository;

import com.tinashe.projectservice.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(String ownerId);
}
