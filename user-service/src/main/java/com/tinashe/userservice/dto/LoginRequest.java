package com.tinashe.userservice.dto;

public record LoginRequest(
    String usernameOrEmail,
    String password
) {}
