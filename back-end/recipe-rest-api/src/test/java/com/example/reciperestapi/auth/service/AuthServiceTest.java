package com.example.reciperestapi.auth.service;

import com.example.reciperestapi.auth.model.AuthRequest;
import com.example.reciperestapi.auth.model.AuthResponse;
import com.example.reciperestapi.auth.model.RefreshTokenRequest;
import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private AuthRequest authRequest;
    private RefreshTokenRequest refreshTokenRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");

        authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");

        refreshTokenRequest = new RefreshTokenRequest();
        refreshTokenRequest.setRefreshToken("validRefreshToken");
    }

    @Test
    void signup_ShouldCreateNewUserAndReturnToken() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(testUser)).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refreshToken");

        // When
        AuthResponse response = authService.signup(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("1", response.getLocalId());
        assertEquals("jwtToken", response.getIdToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals(3600, response.getExpiresIn());

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
        verify(jwtService).generateRefreshToken(any(User.class));
    }

    @Test
    void signup_WithExistingEmail_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When/Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.signup(authRequest);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refreshToken");

        // When
        AuthResponse response = authService.login(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("1", response.getLocalId());
        assertEquals("jwtToken", response.getIdToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals(3600, response.getExpiresIn());

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtService).generateToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    void login_WithNonExistentUser_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // When/Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.login(authRequest);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_WithInvalidPassword_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(false);

        // When/Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.login(authRequest);
        });

        assertEquals("Invalid password", exception.getMessage());
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void refreshToken_WithValidRefreshToken_ShouldReturnNewAccessToken() {
        // Given
        when(jwtService.isRefreshTokenValid("validRefreshToken")).thenReturn(true);
        when(jwtService.extractUsername("validRefreshToken")).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateTokenFromRefreshToken("validRefreshToken")).thenReturn("newAccessToken");

        // When
        AuthResponse response = authService.refreshToken(refreshTokenRequest);

        // Then
        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("1", response.getLocalId());
        assertEquals("newAccessToken", response.getIdToken());
        assertEquals("validRefreshToken", response.getRefreshToken());
        assertEquals(3600, response.getExpiresIn());

        verify(jwtService).isRefreshTokenValid("validRefreshToken");
        verify(jwtService).extractUsername("validRefreshToken");
        verify(userRepository).findByEmail("test@example.com");
        verify(jwtService).generateTokenFromRefreshToken("validRefreshToken");
    }

    @Test
    void refreshToken_WithInvalidRefreshToken_ShouldThrowException() {
        // Given
        when(jwtService.isRefreshTokenValid("validRefreshToken")).thenReturn(false);

        // When/Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.refreshToken(refreshTokenRequest);
        });

        assertEquals("Invalid refresh token", exception.getMessage());
        verify(jwtService).isRefreshTokenValid("validRefreshToken");
        verify(jwtService, never()).extractUsername(anyString());
        verify(userRepository, never()).findByEmail(anyString());
        verify(jwtService, never()).generateTokenFromRefreshToken(anyString());
    }
}
