package com.tinashe.projectservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tinashe.projectservice.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
