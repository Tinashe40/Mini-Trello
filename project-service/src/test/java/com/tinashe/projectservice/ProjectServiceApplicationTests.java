package com.tinashe.projectservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.tinashe.projectservice.security.JwtAuthenticationFilter;
import com.tinashe.projectservice.service.ProjectServiceImpl;
import com.tinashe.projectservice.util.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectServiceApplicationTests {

    @MockBean
    private ProjectServiceImpl projectService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean // Add this line
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void contextLoads() {
    }
}