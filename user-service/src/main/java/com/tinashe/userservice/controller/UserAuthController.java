package com.tinashe.userservice.controller;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tinashe.userservice.dto.LoginRequest;
import com.tinashe.userservice.dto.RegisterRequest;
import com.tinashe.userservice.dto.UpdateUserRequest;
import com.tinashe.userservice.dto.UserResponse;
import com.tinashe.userservice.service.AuthService;
import com.tinashe.userservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth") // Base path
@RequiredArgsConstructor
public class UserAuthController {

    private final UserService userService;
    private final AuthService authService;

    // AUTHENTICATION
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // USER MANAGEMENT
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<Void> assignRoleToUser(@PathVariable Long id, @RequestParam String role) {
        userService.assignRoleToUser(id, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Set<String>> getUserRoles(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserRoles(id));
    }
}
