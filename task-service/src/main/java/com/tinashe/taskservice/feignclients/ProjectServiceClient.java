package com.tinashe.taskservice.feignclients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.tinashe.taskservice.models.Project;

@FeignClient(name = "project-service", url = "${feign.client.config.project-service.url}")
public interface ProjectServiceClient {
    @GetMapping("/api/projects/{id}")
    Project getProjectById(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token);
}
