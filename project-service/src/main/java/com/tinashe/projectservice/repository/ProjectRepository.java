package com.tinashe.projectservice.repository;

import com.tinashe.projectservice.entity.Project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
  List<Project> findByCreatedBy(Long userId);
  List<Project> findByStatus(String status);
}