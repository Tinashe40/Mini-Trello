package com.tinashe.userservice.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @Column(unique=true)
  @Schema(description="Unique username", example="tinash_e")
  private String username;

  @Email
  @Schema(description = "Valid email address", example = "tinash_e@gmail.com")
  private String email;

  @Schema(description = "Password (min 8 characters)", example = "password123")
  private String password;

  @Enumerated(EnumType.STRING)
  private Role role;
}
