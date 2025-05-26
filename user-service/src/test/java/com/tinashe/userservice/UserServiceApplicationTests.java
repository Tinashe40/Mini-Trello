package com.tinashe.userservice;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.tinashe.userservice.security.JwtUtil;
import com.tinashe.userservice.service.UserService;


@SpringBootTest
@AutoConfigureMockMvc
public class UserServiceApplicationTests {

    @Test
    void contextLoads() {
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public UserService userService() {
            return mock(UserService.class);
        }
        @MockBean
        private UserDetailsService userDetailsService;

        @Bean
        @Primary
        public JwtUtil jwtUtil() {
            return mock(JwtUtil.class);
        }
    }
}