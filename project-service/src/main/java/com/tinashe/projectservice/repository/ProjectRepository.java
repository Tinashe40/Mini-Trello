package com.tinashe.projectservice.repository;

import com.tinashe.projectservice.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}