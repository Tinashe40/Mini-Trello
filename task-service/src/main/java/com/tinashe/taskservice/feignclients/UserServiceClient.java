package com.tinashe.taskservice.feignclients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.tinashe.taskservice.models.User;

@FeignClient(name = "user-service", url = "${feign.client.config.user-service.url}")
public interface UserServiceClient {
    @GetMapping("/api/users/{id}")
    User getUserById(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token);
}