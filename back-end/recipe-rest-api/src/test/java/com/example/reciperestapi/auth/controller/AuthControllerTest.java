package com.example.reciperestapi.auth.controller;

import com.example.reciperestapi.auth.model.AuthRequest;
import com.example.reciperestapi.auth.model.AuthResponse;
import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import com.example.reciperestapi.auth.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        // Clear users before each test
        userRepository.deleteAll();
    }

    @Test
    void signup_ShouldCreateNewUser() throws Exception {
        // Given
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        // When
        MvcResult result = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        // Then
        AuthResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), AuthResponse.class);

        // Verify response
        assertNotNull(response.getIdToken());
        assertEquals("test@example.com", response.getEmail());
        assertNotNull(response.getLocalId());
        assertEquals(3600, response.getExpiresIn());

        // Verify user was created in database
        User savedUser = userRepository.findByEmail("test@example.com").orElse(null);
        assertNotNull(savedUser);
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
    }

    @Test
    void signup_WithExistingEmail_ShouldReturnError() throws Exception {
        // Given a pre-existing user
        User existingUser = new User();
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("existingPassword"));
        userRepository.save(existingUser);

        // When trying to signup with the same email
        AuthRequest request = new AuthRequest();
        request.setEmail("existing@example.com");
        request.setPassword("newPassword");

        // Then expect error
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andReturn();
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() throws Exception {
        // Given a registered user
        User user = new User();
        user.setEmail("login@example.com");
        user.setPassword(passwordEncoder.encode("correctPassword"));
        userRepository.save(user);

        // When login with correct credentials
        AuthRequest request = new AuthRequest();
        request.setEmail("login@example.com");
        request.setPassword("correctPassword");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        // Then
        AuthResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), AuthResponse.class);

        // Verify token
        assertNotNull(response.getIdToken());
        assertEquals("login@example.com", response.getEmail());

        // Verify token is valid
        String token = response.getIdToken();
        String email = jwtService.extractUsername(token);
        assertEquals("login@example.com", email);
    }

    @Test
    void login_WithInvalidPassword_ShouldReturnError() throws Exception {
        // Given a registered user
        User user = new User();
        user.setEmail("password@example.com");
        user.setPassword(passwordEncoder.encode("correctPassword"));
        userRepository.save(user);

        // When login with wrong password
        AuthRequest request = new AuthRequest();
        request.setEmail("password@example.com");
        request.setPassword("wrongPassword");

        // Then expect error
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andReturn();
    }

    @Test
    void login_WithNonExistentUser_ShouldReturnError() throws Exception {
        // Given a non-existent user email
        AuthRequest request = new AuthRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("anyPassword");

        // Then expect error
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andReturn();
    }
}
