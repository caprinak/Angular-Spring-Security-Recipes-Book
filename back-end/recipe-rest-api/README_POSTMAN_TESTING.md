# Testing the Recipe REST API with Postman

This README provides instructions on how to test the Recipe REST API using Postman.

## Files Included

1. **postman_testing_guide_updated.md** - A comprehensive guide for testing the Recipe REST API with Postman
2. **recipe_api_postman_collection_updated.json** - An updated Postman collection file with all API endpoints

## How to Use

### Import the Postman Collection

1. Open Postman
2. Click on "Import" in the top left corner
3. Select "File" and choose the `recipe_api_postman_collection_updated.json` file
4. Click "Import"

### Create an Environment (Optional but Recommended)

1. Click on the gear icon in the top right corner of Postman
2. Click "Add" to create a new environment
3. Name it "Recipe API Environment"
4. Add the following variables (leave the values empty, they will be populated automatically):
   - `jwt_token`
   - `refresh_token`
5. Click "Save"
6. Select the environment from the dropdown in the top right corner

### Follow the Testing Guide

1. Open the `postman_testing_guide_updated.md` file
2. Follow the instructions in the guide to test the API endpoints

## Key Improvements in the Updated Files

The updated Postman collection and testing guide include the following improvements:

1. Added the missing PUT endpoint for updating recipes (`PUT /api/batch/recipes`)
2. Added the `category` field to Recipe objects with valid values from the MealCategory enum
3. Added the `units` field to Ingredient objects
4. Added a section explaining the available meal categories
5. Improved the test script to automatically save both JWT token and refresh token to environment variables
6. Updated the testing flow to include testing the update endpoint

## Testing Flow

Here's a recommended testing flow:

1. Register a new user using the signup endpoint
2. Login with the registered user credentials
3. Use the JWT token to access the protected recipe endpoints
4. Test getting all recipes
5. Test saving new recipes
6. Test updating existing recipes
7. Test replacing all recipes
8. When the JWT token expires, use the refresh token to get a new JWT token

## Troubleshooting

If you encounter any issues while testing the API, refer to the "Troubleshooting" section in the `postman_testing_guide_updated.md` file.