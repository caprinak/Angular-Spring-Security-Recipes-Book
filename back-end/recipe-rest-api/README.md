# Recipe REST API - Postman Testing Guide

This repository contains a Spring Boot REST API for a recipe application with JWT authentication. This README provides instructions on how to test the API using Postman.

## Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine
- MySQL database server running
- Spring Boot application running

## Getting Started

### 1. Start the Application

1. Make sure your MySQL database server is running
2. Start the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   or
   ```
   mvnw.cmd spring-boot:run
   ```
   (for Windows)

The server will start on port 8080.

### 2. Import Postman Collection

1. Open Postman
2. Click on "Import" button
3. Select the `recipe_api_postman_collection.json` file from this repository
4. Click "Import"

The collection contains pre-configured requests for all endpoints.

## Testing the API

### Authentication

The API uses JWT (JSON Web Token) for authentication. The collection includes:

1. **User Signup**: Create a new user account
   - Endpoint: `POST http://localhost:8080/api/auth/signup`
   - Body: Email, password, and returnSecureToken flag

2. **User Login**: Login with existing credentials
   - Endpoint: `POST http://localhost:8080/api/auth/login`
   - Body: Email, password, and returnSecureToken flag

Both endpoints return a JWT token in the `idToken` field of the response. The collection is configured to automatically extract this token and store it in the `jwt_token` environment variable for use in subsequent requests.

### Recipe Endpoints (Protected)

All recipe endpoints require authentication with a valid JWT token. The collection is configured to automatically include the token in the Authorization header.

1. **Get All Recipes**: Retrieve all recipes
   - Endpoint: `GET http://localhost:8080/api/batch/recipes`
   - Requires authentication

2. **Save Multiple Recipes**: Create multiple recipes at once
   - Endpoint: `POST http://localhost:8080/api/batch/recipes`
   - Requires authentication
   - Body: Array of recipe objects

3. **Replace All Recipes**: Replace all existing recipes
   - Endpoint: `PUT http://localhost:8080/api/recipes/replace-all`
   - Requires authentication
   - Body: Array of recipe objects

## Testing Flow

For a complete test of the API, follow these steps:

1. Execute the "User Signup" request with a new email and password
2. Execute the "User Login" request with the same credentials
3. The JWT token will be automatically stored in the environment
4. Execute the "Get All Recipes" request (should return an empty array if no recipes exist)
5. Execute the "Save Multiple Recipes" request to create some recipes
6. Execute the "Get All Recipes" request again to verify the recipes were created
7. Execute the "Replace All Recipes" request to replace the existing recipes
8. Execute the "Get All Recipes" request again to verify the recipes were replaced

## Detailed Documentation

For more detailed information about the API endpoints and request/response formats, refer to the `postman_testing_guide.md` file in this repository.

## Troubleshooting

- If you receive a 401 Unauthorized error, your JWT token may have expired. Try logging in again to get a new token.
- If you receive a 400 Bad Request error, check your request body format and ensure all required fields are included.
- If you receive a 500 Internal Server Error, check the server logs for more details.

## JWT Token Information

The JWT tokens issued by this API:
- Expire after 1 hour (3600 seconds)
- Contain the user's email as the subject
- Include the user's ID as a claim

You can inspect your JWT token at [jwt.io](https://jwt.io/) to verify its contents.