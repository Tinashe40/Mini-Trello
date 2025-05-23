package com.tinashe.projectservice.FeignClients;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            String token = SecurityContextHolder.getContext().getAuthentication().getCredentials().toString();
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }
}