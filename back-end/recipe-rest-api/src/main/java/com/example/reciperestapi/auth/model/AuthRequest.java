package com.example.reciperestapi.auth.model;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
    private boolean returnSecureToken = true;
}
