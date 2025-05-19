package com.tinashe.userservice.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority{
  USER, ADMIN, SUPER_ADMIN;
  // Enum values are implicitly static and final, so no need to declare them as such.
  @Override
  public String getAuthority() {
    return "ROLE_" + name();
  }
}
