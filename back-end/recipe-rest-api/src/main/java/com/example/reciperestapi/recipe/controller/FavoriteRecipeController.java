package com.example.reciperestapi.recipe.controller;

import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.auth.repository.UserRepository;
import com.example.reciperestapi.recipe.dao.FavoriteRecipeRepository;
import com.example.reciperestapi.recipe.dao.RecipeRepository;
import com.example.reciperestapi.recipe.model.FavoriteRecipe;
import com.example.reciperestapi.recipe.model.Recipe;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteRecipeController {

    private static final Logger logger = LoggerFactory.getLogger(FavoriteRecipeController.class);
    private final FavoriteRecipeRepository favoriteRecipeRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Autowired
    public FavoriteRecipeController(
            FavoriteRecipeRepository favoriteRecipeRepository,
            RecipeRepository recipeRepository,
            UserRepository userRepository) {
        this.favoriteRecipeRepository = favoriteRecipeRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all favorite recipes for the current user
     * @return List of favorite recipes
     */
    @GetMapping
    public ResponseEntity<?> getFavoriteRecipes() {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
            }

            List<FavoriteRecipe> favorites = favoriteRecipeRepository.findByUser(currentUser);
            List<Recipe> recipes = favorites.stream()
                    .map(FavoriteRecipe::getRecipe)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(recipes, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting favorite recipes: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error retrieving favorite recipes: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a recipe to favorites
     * @param recipeId ID of the recipe to add to favorites
     * @return Success message
     */
    @PostMapping("/{recipeId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long recipeId) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
            }

            Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
            if (recipeOpt.isEmpty()) {
                return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
            }

            Recipe recipe = recipeOpt.get();
            Optional<FavoriteRecipe> existingFavorite = 
                    favoriteRecipeRepository.findByUserAndRecipe(currentUser, recipe);

            if (existingFavorite.isPresent()) {
                return new ResponseEntity<>(
                        Map.of("message", "Recipe already in favorites"), 
                        HttpStatus.OK);
            }

            FavoriteRecipe favorite = new FavoriteRecipe();
            favorite.setUser(currentUser);
            favorite.setRecipe(recipe);
            favoriteRecipeRepository.save(favorite);

            return new ResponseEntity<>(
                    Map.of("message", "Recipe added to favorites"), 
                    HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error adding favorite: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error adding favorite: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a recipe from favorites
     * @param recipeId ID of the recipe to remove from favorites
     * @return Success message
     */
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long recipeId) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
            }

            Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
            if (recipeOpt.isEmpty()) {
                return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
            }

            Recipe recipe = recipeOpt.get();
            Optional<FavoriteRecipe> existingFavorite = 
                    favoriteRecipeRepository.findByUserAndRecipe(currentUser, recipe);

            if (existingFavorite.isEmpty()) {
                return new ResponseEntity<>(
                        Map.of("message", "Recipe not in favorites"), 
                        HttpStatus.OK);
            }

            favoriteRecipeRepository.delete(existingFavorite.get());

            return new ResponseEntity<>(
                    Map.of("message", "Recipe removed from favorites"), 
                    HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error removing favorite: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error removing favorite: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Check if a recipe is in the user's favorites
     * @param recipeId ID of the recipe to check
     * @return Boolean indicating if the recipe is in favorites
     */
    @GetMapping("/{recipeId}")
    public ResponseEntity<?> isFavorite(@PathVariable Long recipeId) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
            }

            Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
            if (recipeOpt.isEmpty()) {
                return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
            }

            Recipe recipe = recipeOpt.get();
            boolean isFavorite = favoriteRecipeRepository
                    .findByUserAndRecipe(currentUser, recipe)
                    .isPresent();

            return new ResponseEntity<>(
                    Map.of("isFavorite", isFavorite), 
                    HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error checking favorite status: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error checking favorite status: " + e.getMessage(), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Helper method to get the current authenticated user
     * @return The current user or null if not authenticated
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}