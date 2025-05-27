package com.example.reciperestapi.auth.model;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}