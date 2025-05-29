package com.tinashe.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tinashe.userservice.dto.JwtResponse;
import com.tinashe.userservice.dto.LoginRequest;
import com.tinashe.userservice.dto.RefreshTokenRequest;
import com.tinashe.userservice.entity.User;
import com.tinashe.userservice.security.JwtUtil;
import com.tinashe.userservice.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for user registration, authentication, and management")
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Autowired
    public UserController(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil=jwtUtil;
        this.userService=userService;
    }
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user", responses = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "409", description = "Username/email already exists"),
        @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", responses = {
        @ApiResponse(responseCode = "200", description = "Authentication successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<JwtResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwtResponse = userService.authenticateUser(request.usernameOrEmail(), request.password());
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", responses = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    })
    public ResponseEntity<JwtResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String newAccessToken = jwtUtil.refreshAccessToken(request.refreshToken());
        User user = userService.getCurrentUser();

        return ResponseEntity.ok(new JwtResponse(
            newAccessToken,
            request.refreshToken(),
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        ));
    }

    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Logout user and invalidate tokens")
    public ResponseEntity<Void> logout() {
        User user = userService.getCurrentUser();
        jwtUtil.invalidateRefreshToken(user.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user details")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/promote/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Promote user to admin")
    public ResponseEntity<User> promoteToAdmin(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.promoteToAdmin(userId));
    }
}
