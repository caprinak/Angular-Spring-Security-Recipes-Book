package com.example.reciperestapi.auth.repository;

import com.example.reciperestapi.auth.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        testUser = new User();
        testUser.setEmail("repo@example.com");
        testUser.setPassword("encodedPassword");
        userRepository.save(testUser);
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnUser() {
        // When
        Optional<User> found = userRepository.findByEmail("repo@example.com");

        // Then
        assertTrue(found.isPresent());
        assertEquals("repo@example.com", found.get().getEmail());
    }

    @Test
    void findByEmail_WithNonExistentEmail_ShouldReturnEmpty() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void save_ShouldPersistUser() {
        // Given
        User newUser = new User();
        newUser.setEmail("save@example.com");
        newUser.setPassword("savePassword");

        // When
        User saved = userRepository.save(newUser);

        // Then
        assertNotNull(saved.getId());
        assertEquals("save@example.com", saved.getEmail());
        
        // Verify it's in the database
        Optional<User> fromDb = userRepository.findById(saved.getId());
        assertTrue(fromDb.isPresent());
        assertEquals("save@example.com", fromDb.get().getEmail());
    }

    @Test
    void save_WithDuplicateEmail_ShouldThrowException() {
        // Given
        User duplicate = new User();
        duplicate.setEmail("repo@example.com"); // Same as testUser
        duplicate.setPassword("differentPassword");

        // When/Then
        assertThrows(Exception.class, () -> {
            userRepository.save(duplicate);
            userRepository.flush(); // Force the exception to be thrown
        });
    }
}
