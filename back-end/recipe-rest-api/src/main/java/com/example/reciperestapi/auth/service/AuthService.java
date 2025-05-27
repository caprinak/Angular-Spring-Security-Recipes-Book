package com.example.reciperestapi.auth.service;

import com.example.reciperestapi.auth.model.AuthRequest;
import com.example.reciperestapi.auth.model.AuthResponse;
import com.example.reciperestapi.auth.model.RefreshTokenRequest;
import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(AuthRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        // Generate JWT tokens
        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        // Create response
        return AuthResponse.builder()
                .email(savedUser.getEmail())
                .localId(savedUser.getId().toString())
                .idToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(3600) // Token expires in 1 hour
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Create response
        return AuthResponse.builder()
                .email(user.getEmail())
                .localId(user.getId().toString())
                .idToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(3600) // Token expires in 1 hour
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        // Validate refresh token
        String refreshToken = request.getRefreshToken();
        if (!jwtService.isRefreshTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Extract user information from refresh token
        String email = jwtService.extractUsername(refreshToken);

        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new access token
        String newAccessToken = jwtService.generateTokenFromRefreshToken(refreshToken);

        // Create response
        return AuthResponse.builder()
                .email(user.getEmail())
                .localId(user.getId().toString())
                .idToken(newAccessToken)
                .refreshToken(refreshToken) // Return the same refresh token
                .expiresIn(3600) // Token expires in 1 hour
                .build();
    }
}
