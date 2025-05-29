package com.tinashe.userservice.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import com.tinashe.userservice.entity.User;

import io.jsonwebtoken.*;

import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    public static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 minutes
    public static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 days
    public static final String TOKEN_TYPE_ACCESS = "access";
    public static final String TOKEN_TYPE_REFRESH = "refresh";

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey key;
    private final ConcurrentHashMap<String, String> refreshTokenStore = new ConcurrentHashMap<>();
    private final UserDetailsService userDetailsService;

    public JwtUtil(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("type", TOKEN_TYPE_ACCESS)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(User user) {
        String refreshToken = Jwts.builder()
                .subject(user.getUsername())
                .claim("type", TOKEN_TYPE_REFRESH)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();

        refreshTokenStore.put(user.getUsername(), refreshToken);
        return refreshToken;
    }

    public String refreshAccessToken(String refreshToken) throws JwtException {
        if (!isRefreshToken(refreshToken)) {
            throw new JwtException("Invalid refresh token");
        }

        String username = extractUsername(refreshToken);
        String storedRefreshToken = refreshTokenStore.get(username);

        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new JwtException("Refresh token is invalid or expired");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!(userDetails instanceof User user)) {
            throw new JwtException("Invalid user details");
        }

        return generateAccessToken(user);
    }

    public boolean isRefreshToken(String token) {
        try {
            return TOKEN_TYPE_REFRESH.equals(parseToken(token).getPayload().get("type", String.class));
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return parseToken(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public void invalidateRefreshToken(String username) {
        refreshTokenStore.remove(username);
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }
}
