package com.tinashe.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tinashe.userservice.dto.JwtResponse;
import com.tinashe.userservice.entity.User;
import com.tinashe.userservice.entity.UserRole;
import com.tinashe.userservice.exception.DuplicateUserException;
import com.tinashe.userservice.repository.UserRepository;
import com.tinashe.userservice.security.JwtUtil;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager){
        this.userRepository=userRepository;
        this.jwtUtil=jwtUtil;
        this.passwordEncoder=passwordEncoder;
        this.authenticationManager=authenticationManager;
    }

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException("Username is already taken");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateUserException("Email is already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.USER); // Optional: set default role
        return userRepository.save(user);
    }

    @Override
    public JwtResponse authenticateUser(String usernameOrEmail, String password) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(usernameOrEmail, password)
        );

        User user = userRepository
            .findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return new JwtResponse(
            jwtUtil.generateAccessToken(user),
            jwtUtil.generateRefreshToken(user),
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
    }

    @Override
    public User promoteToAdmin(Long userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.ADMIN);
        return userRepository.save(user);
    }
}
