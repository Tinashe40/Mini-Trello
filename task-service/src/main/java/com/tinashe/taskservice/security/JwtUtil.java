package com.tinashe.taskservice.security;

import java.security.Key;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "8c7ee55ddd5216622d83b1bcf1da0586995594c06da13fac8e308d2cc9b42780c93b69bbac7f54695bc95082274ab297a9e6bbbcdd401dd0a1b40e427b20d03b";
    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String extractUsername(String token) {
        Claims claims = getClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT: " + e.getMessage());
        }
        return false;
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                       .setSigningKey(SIGNING_KEY)
                       .build()
                       .parseClaimsJws(token)
                       .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Error parsing JWT token: " + e.getMessage());
        }
        return null;
    }
}
