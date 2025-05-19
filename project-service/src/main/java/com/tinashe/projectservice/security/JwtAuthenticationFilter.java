package com.tinashe.projectservice.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import com.tinashe.projectservice.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log=LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private static final String BEARER_PREFIX = "Bearer ";
    private static final int TOKEN_START_INDEX = 7;
    private static final String AUTH_HEADER = "Authorization";
    private static final String ROLE_PREFIX = "ROLE_";

    private final JwtUtil jwtUtil;
    private final List<String> permitAllUrls;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtAuthenticationFilter(JwtUtil jwtUtil, String[] permitAllUrls) {
        this.jwtUtil = jwtUtil;
        this.permitAllUrls = List.of(permitAllUrls);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) 
        throws ServletException, IOException {
        
        try {
            if (shouldSkipAuthentication(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            processAuthorizationHeader(request, response);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handleSecurityException(response, e);
        }
    }

    private boolean shouldSkipAuthentication(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        return permitAllUrls.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, requestUri));
    }

    private void processAuthorizationHeader(HttpServletRequest request, 
                                           HttpServletResponse response) 
        throws IOException {
        
        String authHeader = request.getHeader(AUTH_HEADER);
        validateAuthorizationHeader(authHeader, response);
        
        String token = extractToken(authHeader);
        authenticateToken(request, token);
    }

    private void validateAuthorizationHeader(String authHeader, 
                                            HttpServletResponse response) 
        throws IOException {
        
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            log.warn("Missing or invalid Authorization header");
            sendError(response, "Missing or invalid credentials");
            throw new SecurityException("Invalid authorization header");
        }
    }

    private String extractToken(String authHeader) {
        return authHeader.substring(TOKEN_START_INDEX);
    }

    private void authenticateToken(HttpServletRequest request, String token) {
        String username = jwtUtil.extractUsername(token);
        if (username == null) return;

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            validateAndSetAuthentication(request, token, username);
        }
    }

    private void validateAndSetAuthentication(HttpServletRequest request,
                                             String token,
                                             String username) {
        if (jwtUtil.validateToken(token)) {
            List<SimpleGrantedAuthority> authorities = jwtUtil.extractRoles(token)
                .stream()
                .map(role -> role.startsWith(ROLE_PREFIX) ? role : ROLE_PREFIX + role)
                .map(SimpleGrantedAuthority::new)
                .toList();

            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    authorities
                );

            authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    private void handleSecurityException(HttpServletResponse response, 
                                        Exception e) 
        throws IOException {
        
        log.error("Security exception: {}", e.getMessage());
        sendError(response, "Authentication failed: " + e.getMessage());
    }

    private void sendError(HttpServletResponse response, String message) 
        throws IOException {
        
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, message);
    }
}