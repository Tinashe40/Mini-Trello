package com.tinashe.userservice.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tinashe.userservice.dto.LoginRequest;
import com.tinashe.userservice.dto.RegisterRequest;
import com.tinashe.userservice.dto.UserResponse;
import com.tinashe.userservice.entity.User;
import com.tinashe.userservice.exception.EmailAlreadyInUseException;
import com.tinashe.userservice.repository.UserRepository;
import com.tinashe.userservice.security.JwtService;
import com.tinashe.userservice.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyInUseException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole()) // UserRole Enum is directly assigned
                .build();

        userRepository.save(user);

        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), null);
    }

    @Override
public String login(LoginRequest request) {
    Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

    if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
        throw new RuntimeException("Invalid email or password");
    }

    User user = userOpt.get();
    List<String> roles = List.of(user.getRole().name()); // Convert enum to string

    return jwtService.generateToken(user.getEmail(), roles);
}

}
