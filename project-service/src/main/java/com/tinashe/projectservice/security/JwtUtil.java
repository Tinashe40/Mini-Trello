package com.tinashe.projectservice.security;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {

    private final String SECRET = "8c7ee55ddd5216622d83b1bcf1da0586995594c06da13fac8e308d2cc9b42780c93b69bbac7f54695bc95082274ab297a9e6bbbcdd401dd0a1b40e427b20d03b";

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        return getClaims(token) != null;
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            return null;
        }
    }
}
