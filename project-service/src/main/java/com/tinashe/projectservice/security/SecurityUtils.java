package com.tinashe.projectservice.security;

import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility class for accessing current user's security context.
 */
@Component
public class SecurityUtils {

    public boolean isAdmin() {
        return hasRole("ROLE_ADMIN");
    }

    public boolean isUser() {
        return hasRole("ROLE_USER");
    }

    public Long getCurrentUserId() {
        Authentication authentication = getAuthentication();
        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            throw new SecurityException("User ID is not a valid number", e);
        }
    }

    private boolean hasRole(String role) {
        Authentication authentication = getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return authorities.stream()
                .anyMatch(auth -> role.equals(auth.getAuthority()));
    }

    private Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("No authenticated user found");
        }
        return authentication;
    }
}
