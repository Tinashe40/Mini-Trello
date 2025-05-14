package com.tinashe.projectservice.FeignClient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.scheduling.config.Task;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "task-service", configuration = FeignConfig.class)
public interface TaskServiceClient {
    @GetMapping("/api/tasks/project/{projectId}")
    List<Task> getTasksByProjectId(@PathVariable Long projectId);
}