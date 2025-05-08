package com.tinashe.userservice.service;


import com.tinashe.userservice.dto.LoginRequest;
import com.tinashe.userservice.dto.RegisterRequest;
import com.tinashe.userservice.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    String login(LoginRequest request);
}
