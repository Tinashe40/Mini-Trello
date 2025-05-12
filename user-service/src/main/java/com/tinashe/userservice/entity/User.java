package com.tinashe.userservice.entity;

import java.util.HashSet;
import java.util.*;

import com.tinashe.userservice.enums.UserRole;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User{
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToMany(fetch=FetchType.EAGER)
    private Set<Role> roles= new HashSet<>();
}