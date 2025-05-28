# Postman Testing Guide for Recipe REST API

This guide will help you test the Recipe REST API using Postman. The API provides authentication endpoints and recipe management endpoints.

## Server Setup

Before testing, make sure the Spring Boot application is running:

1. Start the MySQL database server
2. Run the Spring Boot application
3. The server will be available at `http://localhost:8080`

## Authentication Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST http://localhost:8080/api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "returnSecureToken": true
}
```

**Expected Response:**
```json
{
  "kind": "identitytoolkit#VerifyPasswordResponse",
  "localId": "1",
  "email": "user@example.com",
  "idToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "AOEOulZDGBn2ywRk4NgpZ1...",
  "registered": true,
  "expiresIn": 3600
}
```

### 2. User Login

**Endpoint:** `POST http://localhost:8080/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "returnSecureToken": true
}
```

**Expected Response:**
```json
{
  "kind": "identitytoolkit#VerifyPasswordResponse",
  "localId": "1",
  "email": "user@example.com",
  "idToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "AOEOulZDGBn2ywRk4NgpZ1...",
  "registered": true,
  "expiresIn": 3600
}
```

### 3. Refresh Token

**Endpoint:** `POST http://localhost:8080/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "AOEOulZDGBn2ywRk4NgpZ1..."
}
```

**Expected Response:**
```json
{
  "kind": "identitytoolkit#VerifyPasswordResponse",
  "localId": "1",
  "email": "user@example.com",
  "idToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "AOEOulZDGBn2ywRk4NgpZ1...",
  "registered": true,
  "expiresIn": 3600
}
```

**Note:** The `idToken` field contains a new access token, while the `refreshToken` field contains the same refresh token that was sent in the request.

## Using JWT Token for Authentication

After successful login or signup, you'll receive a JWT token in the `idToken` field of the response. To access protected endpoints, you need to include this token in the Authorization header of your requests:

1. In Postman, select the request you want to make
2. Go to the "Headers" tab
3. Add a new header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiJ9...` (replace with your actual token)

## Recipe Endpoints (Protected)

All recipe endpoints require authentication with a valid JWT token.

### 1. Get All Recipes

**Endpoint:** `GET http://localhost:8080/api/batch/recipes`

**Headers:**
- Authorization: Bearer {your_jwt_token}

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Tasty Schnitzel",
    "description": "A super-tasty Schnitzel - just awesome!",
    "imagePath": "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
    "category": "DINNER",
    "ingredients": [
      {
        "id": 1,
        "name": "Meat",
        "amount": "1",
        "units": "Pound"
      },
      {
        "id": 2,
        "name": "French Fries",
        "amount": "2",
        "units": "Pounds"
      }
    ]
  }
]
```

### 2. Save Multiple Recipes

**Endpoint:** `POST http://localhost:8080/api/batch/recipes`

**Headers:**
- Authorization: Bearer {your_jwt_token}
- Content-Type: application/json

**Request Body:**
```json
[
  {
    "name": "Tasty Schnitzel",
    "description": "A super-tasty Schnitzel - just awesome!",
    "imagePath": "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
    "category": "DINNER",
    "ingredients": [
      {
        "name": "Meat",
        "amount": "1",
        "units": "Pound"
      },
      {
        "name": "French Fries",
        "amount": "2",
        "units": "Pounds"
      }
    ]
  },
  {
    "name": "Big Fat Burger",
    "description": "What else you need to say?",
    "imagePath": "https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg",
    "category": "LUNCH",
    "ingredients": [
      {
        "name": "Meat",
        "amount": "1",
        "units": "Pound"
      },
      {
        "name": "Buns",
        "amount": "2",
        "units": "Pieces"
      }
    ]
  }
]
```

### 3. Update Multiple Recipes

**Endpoint:** `PUT http://localhost:8080/api/batch/recipes`

**Headers:**
- Authorization: Bearer {your_jwt_token}
- Content-Type: application/json

**Request Body:**
```json
[
  {
    "id": 1,
    "name": "Updated Schnitzel",
    "description": "An updated super-tasty Schnitzel!",
    "imagePath": "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
    "category": "DINNER",
    "ingredients": [
      {
        "id": 1,
        "name": "Premium Meat",
        "amount": "1.5",
        "units": "Pounds"
      },
      {
        "id": 2,
        "name": "French Fries",
        "amount": "2",
        "units": "Pounds"
      }
    ]
  }
]
```

**Note:** When updating recipes, make sure to include the `id` field for both the recipe and its ingredients to ensure they are updated correctly rather than creating new ones.

### 4. Replace All Recipes

**Endpoint:** `PUT http://localhost:8080/api/recipes/replace-all`

**Headers:**
- Authorization: Bearer {your_jwt_token}
- Content-Type: application/json

**Request Body:**
```json
[
  {
    "name": "New Recipe",
    "description": "A new recipe description",
    "imagePath": "https://example.com/image.jpg",
    "category": "BREAKFAST",
    "ingredients": [
      {
        "name": "Ingredient 1",
        "amount": "1",
        "units": "Cup"
      },
      {
        "name": "Ingredient 2",
        "amount": "2",
        "units": "Tablespoons"
      }
    ]
  }
]
```

## Meal Categories

The Recipe API supports the following meal categories:

- BREAKFAST
- LUNCH
- DINNER
- DESSERT
- SNACK
- OTHER

When creating or updating recipes, specify one of these categories in the `category` field.

## Testing Flow

Here's a recommended testing flow:

1. Register a new user using the signup endpoint
2. Login with the registered user credentials
3. Copy the JWT token (idToken) from the login response
4. Copy the refresh token from the login response
5. Use the JWT token to access the protected recipe endpoints
6. Test getting all recipes
7. Test saving new recipes
8. Test updating existing recipes
9. Test replacing all recipes
10. When the JWT token expires (after 1 hour), use the refresh token to get a new JWT token
11. Continue using the new JWT token for authenticated requests

## Troubleshooting

### Common Issues:

1. **401 Unauthorized Error**
   - Make sure you're including the JWT token in the Authorization header
   - Check that the token hasn't expired (tokens expire after 1 hour)
   - Ensure the token format is correct: `Bearer {token}`

2. **400 Bad Request Error**
   - Check your request body format
   - Ensure all required fields are included
   - Verify that the category field contains a valid value (BREAKFAST, LUNCH, DINNER, DESSERT, SNACK, or OTHER)

3. **500 Internal Server Error**
   - Check the server logs for more details
   - Ensure the database is running and accessible

### JWT Token Validation

If you want to inspect your JWT token, you can use tools like [jwt.io](https://jwt.io/) to decode and verify the token contents.

### Refresh Token Usage

The refresh token is used to obtain a new access token (idToken) when the current one expires. Here's how to use it:

1. Store both the access token (idToken) and refresh token securely when you receive them from login or signup
2. Use the access token for all authenticated requests
3. When the access token expires (after 1 hour), send a request to the refresh token endpoint
4. Include the refresh token in the request body
5. Receive a new access token in the response
6. Update your stored access token with the new one
7. Continue using the new access token for authenticated requests

Refresh tokens have a longer lifespan (7 days) than access tokens (1 hour), allowing users to stay logged in without re-entering credentials.