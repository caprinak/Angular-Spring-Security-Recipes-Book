package com.example.reciperestapi.auth.service;

import com.example.reciperestapi.auth.model.AuthRequest;
import com.example.reciperestapi.auth.model.AuthResponse;
import com.example.reciperestapi.auth.model.RefreshTokenRequest;
import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service responsible for user authentication operations.
 * 
 * This class handles user registration (signup), login, and token refreshing.
 * It uses JWT (JSON Web Tokens) for stateless authentication.
 * 
 * Authentication Flow:
 * 1. User registers or logs in
 * 2. Server validates credentials and generates JWT tokens
 * 3. Client stores tokens and uses them for subsequent requests
 * 4. When access token expires, client uses refresh token to get a new one
 */

/**
 * Main service for authentication operations like signup, login, and token refresh.
 * 
 * @Service - Marks this class as a Spring service component
 * @RequiredArgsConstructor - Lombok annotation that creates a constructor for final fields
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    /**
     * Repository to access and manipulate user data in the database
     */
    private final UserRepository userRepository;

    /**
     * Encoder to securely hash passwords before storing them
     * This prevents storing plain text passwords in the database
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Service to handle JWT token operations (generation, validation, etc.)
     */
    private final JwtService jwtService;

    /**
     * Registers a new user in the system.
     * 
     * This method follows these steps:
     * 1. Validates that the email is not already in use
     * 2. Creates a new user with a securely hashed password
     * 3. Generates authentication tokens (JWT)
     * 4. Returns the tokens and user information
     *
     * @param request Contains registration data (email, password)
     * @return AuthResponse with tokens and user information
     * @throws RuntimeException if email already exists
     */
    public AuthResponse signup(AuthRequest request) {
        // Step 1: Check if user already exists to prevent duplicate accounts
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Step 2: Create new user with encoded (hashed) password
        // Never store plain text passwords in the database!
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash the password
        User savedUser = userRepository.save(user); // Save user to database

        // Step 3: Generate JWT tokens
        // Access token - short-lived token used for API access
        String accessToken = jwtService.generateToken(savedUser);
        // Refresh token - longer-lived token used to get new access tokens
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        // Step 4: Create and return the response with tokens and user info
        return AuthResponse.builder()
                .email(savedUser.getEmail())
                .localId(savedUser.getId().toString())
                .idToken(accessToken)         // The JWT access token
                .refreshToken(refreshToken)    // Token to get new access tokens
                .expiresIn(3600)              // Token expires in 1 hour (in seconds)
                .build();
    }

    /**
     * Authenticates a user and provides JWT tokens upon successful login.
     * 
     * This method follows these steps:
     * 1. Finds the user by email
     * 2. Verifies the password matches
     * 3. Generates authentication tokens
     * 4. Returns the tokens and user information
     *
     * @param request Contains login credentials (email, password)
     * @return AuthResponse with tokens and user information
     * @throws RuntimeException if user not found or password invalid
     */
    public AuthResponse login(AuthRequest request) {
        // Step 1: Find user by email
        // If user doesn't exist, throw exception
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: Verify password
        // passwordEncoder.matches checks if the raw password matches the encoded one
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Step 3: Generate JWT tokens after successful authentication
        // Access token - for API requests
        String accessToken = jwtService.generateToken(user);
        // Refresh token - for getting new access tokens
        String refreshToken = jwtService.generateRefreshToken(user);

        // Step 4: Create and return the response with tokens and user info
        return AuthResponse.builder()
                .email(user.getEmail())
                .localId(user.getId().toString())
                .idToken(accessToken)         // The JWT access token
                .refreshToken(refreshToken)    // Token to get new access tokens
                .expiresIn(3600)              // Token expires in 1 hour (in seconds)
                .build();
    }

    /**
     * Refreshes an access token using a valid refresh token.
     * 
     * This is used when an access token expires but the user is still active.
     * Instead of making the user log in again, the client sends the refresh token
     * to get a new access token.
     * 
     * This method follows these steps:
     * 1. Validates the refresh token
     * 2. Extracts user information from the refresh token
     * 3. Generates a new access token
     * 4. Returns the new access token along with the same refresh token
     *
     * @param request Contains the refresh token
     * @return AuthResponse with new access token and existing refresh token
     * @throws RuntimeException if refresh token is invalid or user not found
     */
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        // Step 1: Get and validate the refresh token
        String refreshToken = request.getRefreshToken();
        if (!jwtService.isRefreshTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Step 2: Extract user information (email) from the refresh token
        // This identifies which user is requesting a token refresh
        String email = jwtService.extractUsername(refreshToken);

        // Step 3: Find the user in the database
        // This confirms the user still exists and is active
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 4: Generate a new access token using the refresh token
        // This gives the user continued access without re-authentication
        String newAccessToken = jwtService.generateTokenFromRefreshToken(refreshToken);

        // Step 5: Create and return the response with new access token
        return AuthResponse.builder()
                .email(user.getEmail())
                .localId(user.getId().toString())
                .idToken(newAccessToken)      // The new JWT access token
                .refreshToken(refreshToken)    // Keep the same refresh token
                .expiresIn(3600)              // New token expires in 1 hour (in seconds)
                .build();
    }
}
