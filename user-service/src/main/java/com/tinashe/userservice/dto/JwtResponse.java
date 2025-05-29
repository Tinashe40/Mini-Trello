package com.tinashe.userservice.dto;

import com.tinashe.userservice.entity.UserRole;

public record JwtResponse(
    String accessToken,
    String refreshToken,
    Long id,
    String username,
    String email,
    UserRole role
) {}
