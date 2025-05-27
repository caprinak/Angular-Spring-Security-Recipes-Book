package com.example.reciperestapi.auth.integration;

import com.example.reciperestapi.auth.model.AuthRequest;
import com.example.reciperestapi.auth.model.AuthResponse;
import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        baseUrl = "http://localhost:" + port + "/api/auth";
    }

    @Test
    void completeAuthFlow_ShouldWorkCorrectly() {
        // Step 1: Register a new user
        AuthRequest signupRequest = new AuthRequest();
        signupRequest.setEmail("flow@example.com");
        signupRequest.setPassword("flowPassword");

        ResponseEntity<AuthResponse> signupResponse = restTemplate.postForEntity(
                baseUrl + "/signup",
                signupRequest,
                AuthResponse.class
        );

        assertEquals(200, signupResponse.getStatusCodeValue());
        assertNotNull(signupResponse.getBody());
        assertNotNull(signupResponse.getBody().getIdToken());

        // Step 2: Verify user was created in database
        User savedUser = userRepository.findByEmail("flow@example.com").orElse(null);
        assertNotNull(savedUser);

        // Step 3: Login with the same credentials
        AuthRequest loginRequest = new AuthRequest();
        loginRequest.setEmail("flow@example.com");
        loginRequest.setPassword("flowPassword");

        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
                baseUrl + "/login",
                loginRequest,
                AuthResponse.class
        );

        assertEquals(200, loginResponse.getStatusCodeValue());
        assertNotNull(loginResponse.getBody());
        assertNotNull(loginResponse.getBody().getIdToken());

        // Step 4: Access a protected resource with the token
        // Note: This assumes you have a protected endpoint to test
        // For example:
        /*
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResponse.getBody().getIdToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> protectedResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/protected",
                HttpMethod.GET,
                entity,
                String.class
        );

        assertEquals(200, protectedResponse.getStatusCodeValue());
        */
    }

    @Test
    void registrationWithExistingEmail_ShouldFail() {
        // Given an existing user
        User existingUser = new User();
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("existingPassword"));
        userRepository.save(existingUser);

        // When attempting to register with the same email
        AuthRequest signupRequest = new AuthRequest();
        signupRequest.setEmail("existing@example.com");
        signupRequest.setPassword("newPassword");

        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/signup",
                signupRequest,
                String.class
        );

        // Then should fail
        assertEquals(500, response.getStatusCodeValue()); // Assuming 500 for runtime exception
        assertTrue(response.getBody().contains("Email already exists"));
    }

    @Test
    void loginWithInvalidCredentials_ShouldFail() {
        // Given an existing user
        User existingUser = new User();
        existingUser.setEmail("invalid@example.com");
        existingUser.setPassword(passwordEncoder.encode("correctPassword"));
        userRepository.save(existingUser);

        // When attempting to login with wrong password
        AuthRequest loginRequest = new AuthRequest();
        loginRequest.setEmail("invalid@example.com");
        loginRequest.setPassword("wrongPassword");

        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/login",
                loginRequest,
                String.class
        );

        // Then should fail
        assertEquals(500, response.getStatusCodeValue()); // Assuming 500 for runtime exception
        assertTrue(response.getBody().contains("Invalid password"));
    }
}
