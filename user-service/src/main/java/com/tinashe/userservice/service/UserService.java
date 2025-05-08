package com.tinashe.userservice.service;

import com.tinashe.userservice.dto.LoginRequest;
import com.tinashe.userservice.dto.RegisterRequest;
import com.tinashe.userservice.dto.UpdateUserRequest;
import com.tinashe.userservice.dto.UserResponse;

import java.util.List;
import java.util.Set;

public interface UserService {
    UserResponse register(RegisterRequest request);
    
    UserResponse login(LoginRequest loginRequest);



    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    void deleteUser(Long id);
    UserResponse updateUser(Long id, UpdateUserRequest request);
    void assignRoleToUser(Long userId, String roleName);
    Set<String> getUserRoles(Long userId);
}
