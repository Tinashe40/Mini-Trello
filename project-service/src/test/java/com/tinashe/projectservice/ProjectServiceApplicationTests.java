package com.tinashe.projectservice;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.tinashe.projectservice.security.JwtFilter;
import com.tinashe.projectservice.security.JwtUtil; // Or util.JwtUtil
import com.tinashe.projectservice.service.ProjectService;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectServiceApplicationTests {

    @MockBean
    private ProjectService projectService;

    @MockBean
    private JwtUtil jwtUtil; // Matches the retained bean

    @MockBean
    private JwtFilter jwtFilter;

    @Test
    void contextLoads() {
    }
}