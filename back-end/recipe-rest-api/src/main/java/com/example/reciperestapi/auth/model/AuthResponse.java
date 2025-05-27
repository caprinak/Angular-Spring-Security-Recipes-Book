package com.example.reciperestapi.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String kind = "identitytoolkit#VerifyPasswordResponse";
    private String localId;      // This will be our user ID
    private String email;
    private String displayName;
    private String idToken;      // JWT token
    private String refreshToken; // Refresh token for getting a new idToken
    private boolean registered = true;
    private int expiresIn;      // Token expiration time in seconds
}
