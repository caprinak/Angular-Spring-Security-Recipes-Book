package com.example.reciperestapi.auth.service;

import com.example.reciperestapi.auth.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Date;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=testSecretKeyMustBeAtLeast32BytesLongForTesting",
        "jwt.expiration=3600000"
})
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("jwt@example.com");
        testUser.setPassword("encodedPassword");
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, testUser));
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String extractedEmail = jwtService.extractUsername(token);

        // Then
        assertEquals("jwt@example.com", extractedEmail);
    }

    @Test
    void isTokenValid_WithWrongUser_ShouldReturnFalse() {
        // Given
        String token = jwtService.generateToken(testUser);

        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@example.com");
        otherUser.setPassword("otherPassword");

        // When/Then
        assertFalse(jwtService.isTokenValid(token, otherUser));
    }

    @Test
    public void testGenerateToken() {
        // Create a test user
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("password");

        // Generate token
        String token = jwtService.generateToken(user);

        // Print debug information
        System.out.println("[DEBUG_LOG] Generated token: " + token);

        // Verify token is not null
        assertNotNull(token, "Token should not be null");
    }

    // Implementation of token expiration test
    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        try {
            // Use reflection to access the private method
            Method isTokenExpiredMethod = JwtService.class.getDeclaredMethod("isTokenExpired", String.class);
            isTokenExpiredMethod.setAccessible(true);

            // Create a token with a very short expiration time
            // First, get the secretKeyString and expirationTime fields
            Field secretKeyField = JwtService.class.getDeclaredField("secretKeyString");
            secretKeyField.setAccessible(true);
            String secretKey = (String) secretKeyField.get(jwtService);

            // Create a token that expires immediately (1ms expiration)
            String expiredToken = Jwts.builder()
                    .setSubject(testUser.getEmail())
                    .claim("userId", testUser.getId())
                    .setIssuedAt(new Date(System.currentTimeMillis() - 2000)) // 2 seconds ago
                    .setExpiration(new Date(System.currentTimeMillis() - 1000)) // 1 second ago (already expired)
                    .compact();

            System.out.println("[DEBUG_LOG] Created expired token for testing");

            // Verify the token is considered expired
            // We can't directly use isTokenValid because it checks both username and expiration
            // So we'll verify that isTokenExpired returns true
            Boolean isExpired = (Boolean) isTokenExpiredMethod.invoke(jwtService, expiredToken);
            assertTrue(isExpired, "Token with past expiration date should be considered expired");

            System.out.println("[DEBUG_LOG] Successfully tested expired token validation");
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Error in expired token test: " + e.getMessage());
            e.printStackTrace();
            fail("Exception occurred during expired token test: " + e.getMessage());
        }
    }
}
