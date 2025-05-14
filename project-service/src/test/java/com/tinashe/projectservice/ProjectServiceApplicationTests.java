package com.tinashe.projectservice;

import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import com.tinashe.projectservice.service.ProjectService;
import com.tinashe.projectservice.util.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectServiceApplicationTests {

    @Test
    void contextLoads() {
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public ProjectService projectService() {
            return mock(ProjectService.class);
        }

        @Bean
        @Primary
        public JwtUtil jwtUtil() {
            return mock(JwtUtil.class);
        }
    }
}
