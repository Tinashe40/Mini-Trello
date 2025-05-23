package com.tinashe.userservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tinashe.userservice.entity.User;
import com.tinashe.userservice.entity.UserRole;
import com.tinashe.userservice.exception.DuplicateUserException;
import com.tinashe.userservice.exception.UserNotFoundException;
import com.tinashe.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateUserException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    public User promoteToAdmin(Long userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.ADMIN);
        return userRepository.save(user);
    }
}
