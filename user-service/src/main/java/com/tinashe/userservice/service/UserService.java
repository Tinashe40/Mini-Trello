package com.tinashe.userservice.service;

import com.tinashe.userservice.dto.JwtResponse;
import com.tinashe.userservice.entity.User;

public interface UserService {
    User registerUser(User user);
    JwtResponse authenticateUser(String usernameOrEmail, String password);
    User getCurrentUser();
    User getUserById(Long id);
    User promoteToAdmin(Long userId);
}
