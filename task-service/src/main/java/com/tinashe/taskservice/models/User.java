package com.tinashe.taskservice.models;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private String role;
}