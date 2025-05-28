package com.example.reciperestapi.auth.filter;

import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import com.example.reciperestapi.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final String userEmail;

            // Log the request URL and method for debugging
            System.out.println("Request URL: " + request.getRequestURL() + ", Method: " + request.getMethod());

            if (authHeader == null) {
                System.out.println("Authorization header is missing");
                // Only apply authentication for protected endpoints
                if (isProtectedEndpoint(request)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Authentication error: Authorization header is missing");
                    return;
                }
                filterChain.doFilter(request, response);
                return;
            }

            if (!authHeader.startsWith("Bearer ")) {
                System.out.println("Authorization header does not start with 'Bearer '");
                if (isProtectedEndpoint(request)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Authentication error: Authorization header must start with 'Bearer '");
                    return;
                }
                filterChain.doFilter(request, response);
                return;
            }

            jwt = authHeader.substring(7);
            System.out.println("JWT token: " + jwt.substring(0, Math.min(10, jwt.length())) + "...");

            userEmail = jwtService.extractUsername(jwt);
            System.out.println("Extracted email: " + userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<User> userOptional = userRepository.findByEmail(userEmail);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    if (jwtService.isTokenValid(jwt, user)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userEmail,
                                null,
                                new ArrayList<>()
                        );
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("Authentication successful for user: " + userEmail);
                    } else {
                        System.out.println("Token is not valid");
                        if (isProtectedEndpoint(request)) {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Authentication error: Token is not valid or has expired");
                            return;
                        }
                    }
                } else {
                    System.out.println("User not found: " + userEmail);
                    if (isProtectedEndpoint(request)) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("Authentication error: User not found");
                        return;
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication error: " + e.getMessage());
        }
    }

    private boolean isProtectedEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/recipes") || path.startsWith("/api/batch/recipes");
    }
}
