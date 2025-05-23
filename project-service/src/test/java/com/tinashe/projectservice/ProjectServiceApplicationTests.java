package com.tinashe.projectservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.tinashe.projectservice.security.JwtFilter;
import com.tinashe.projectservice.service.ProjectService;
import com.tinashe.projectservice.util.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectServiceApplicationTests {

    @MockBean
    private ProjectService projectService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtFilter jwtFilter; // Changed from JwtAuthenticationFilter

    @Test
    void contextLoads() {
        // Test will verify the application context starts successfully
    }
}