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

/**
 * This filter intercepts every HTTP request to check for JWT authentication.
 * 
 * How JWT Authentication Works:
 * 1. Client sends request with JWT token in Authorization header
 * 2. This filter extracts and validates the token
 * 3. If valid, it sets the user as authenticated in Spring Security
 * 4. The request continues to the intended endpoint
 *
 * This is part of a stateless authentication system where the server doesn't
 * need to store session information - all auth data is in the token itself.
 */

/**
 * A Spring Security filter that runs once for each HTTP request.
 * It checks for valid JWT tokens and authenticates users accordingly.
 * 
 * @Component - Tells Spring to create an instance of this class as a bean
 * @RequiredArgsConstructor - Lombok annotation that generates a constructor for final fields
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * Service responsible for JWT operations like generating, validating, and parsing tokens
     */
    private final JwtService jwtService;

    /**
     * Repository to access user data from the database
     */
    private final UserRepository userRepository;

    /**
     * This method is called for every HTTP request and implements the JWT authentication logic.
     *
     * @param request The incoming HTTP request
     * @param response The HTTP response
     * @param filterChain The chain of filters to execute
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            // Step 1: Extract the Authorization header from the request
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final String userEmail;

            // Step 2: Check if the Authorization header exists and has the correct format
            // If not, we skip authentication and proceed with the request as unauthenticated
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // Continue with the filter chain without authentication
                filterChain.doFilter(request, response);
                return;
            }

            // Step 3: Extract the JWT token (remove the "Bearer " prefix)
            jwt = authHeader.substring(7); // Skip "Bearer " which is 7 characters

            // Step 4: Extract the username (email) from the token
            userEmail = jwtService.extractUsername(jwt);

            // Step 5: Authenticate the user if not already authenticated
            // We only proceed if we successfully extracted a username and user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Step 6: Find the user in the database by email
                Optional<User> userOptional = userRepository.findByEmail(userEmail);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    // Step 7: Validate the token (check signature, expiration, etc.)
                    if (jwtService.isTokenValid(jwt, user)) {
                        // Step 8: Create an authentication token for Spring Security
                        // This is what tells Spring Security that the user is authenticated
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userEmail,    // Principal (identifies the user)
                                null,          // Credentials (not needed here as we validated with JWT)
                                new ArrayList<>() // Authorities/roles (empty list for now)
                        );

                        // Step 9: Add request details to the authentication token
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // Step 10: Set the authentication in Spring Security's context
                        // This marks the user as authenticated for this request
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }

            // Step 11: Continue with the filter chain
            // At this point, the user is either authenticated or not
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            // Step 12: Handle any authentication errors
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // HTTP 401 Unauthorized
            response.getWriter().write("Authentication error: " + e.getMessage());
        }
    }
}
