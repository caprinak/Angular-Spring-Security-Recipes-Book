package com.example.reciperestapi.recipe.controller;

import com.example.reciperestapi.recipe.dao.RecipeRepository;
import com.example.reciperestapi.recipe.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RecipeController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    private final RecipeRepository recipeRepository;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RecipeController(RecipeRepository recipeRepository, JdbcTemplate jdbcTemplate) {
        this.recipeRepository = recipeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Endpoint to save multiple recipes in a single request
     * @param recipes List of recipes to save
     * @return List of saved recipes with generated IDs
     */
    @PostMapping("/batch/recipes")
    public ResponseEntity<List<Recipe>> saveRecipes(@RequestBody List<Recipe> recipes) {
        List<Recipe> savedRecipes = recipeRepository.saveAll(recipes);
        return new ResponseEntity<>(savedRecipes, HttpStatus.CREATED);
    }

    @PutMapping("/batch/recipes")
    public ResponseEntity<List<Recipe>> updateRecipes(@RequestBody List<Recipe> recipes) {
        List<Recipe> savedRecipes = recipeRepository.saveAll(recipes);
        return new ResponseEntity<>(savedRecipes, HttpStatus.CREATED);
    }

    @GetMapping("/batch/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        logger.info("Entering getAllRecipes method");
        try {
            logger.debug("Calling recipeRepository.findAll()");
            List<Recipe> allRecipes = recipeRepository.findAll();

            if (allRecipes == null) {
                logger.error("recipeRepository.findAll() returned null");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            logger.info("recipeRepository.findAll() returned {} recipes", allRecipes.size());

            if (allRecipes.isEmpty()) {
                logger.warn("No recipes found in the database");
            } else {
                for (Recipe recipe : allRecipes) {
                    logger.debug("Recipe found: ID={}, Name={}, Category={}", 
                        recipe.getId(), recipe.getName(), recipe.getCategory());
                }
            }

            return new ResponseEntity<>(allRecipes, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in getAllRecipes: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint to replace all recipes with a new list (delete existing and save new)
     * @param recipes List of recipes to replace existing ones
     * @return List of saved recipes with generated IDs
     */
    @PutMapping("/recipes/replace-all")
    public ResponseEntity<List<Recipe>> replaceAllRecipes(@RequestBody List<Recipe> recipes) {
        // Delete all existing recipes
        recipeRepository.deleteAll();
        // Save all new recipes
        List<Recipe> savedRecipes = recipeRepository.saveAll(recipes);
        return new ResponseEntity<>(savedRecipes, HttpStatus.OK);
    }

    /**
     * Debug endpoint to check database connection and recipe repository
     * @return Debug information about database and repository
     */
    @GetMapping("/debug/recipes")
    public ResponseEntity<Map<String, Object>> debugRecipes() {
        logger.info("Entering debugRecipes method");
        Map<String, Object> debugInfo = new HashMap<>();

        try {
            // Check database connection
            debugInfo.put("database_connection", "Testing...");
            try {
                Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
                debugInfo.put("database_connection", result != null && result == 1 ? "Success" : "Failed");
            } catch (Exception e) {
                debugInfo.put("database_connection", "Failed: " + e.getMessage());
                logger.error("Database connection test failed", e);
            }

            // Check recipe table
            debugInfo.put("recipe_table", "Testing...");
            try {
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM recipe", Integer.class);
                debugInfo.put("recipe_table", "Exists, contains " + count + " records");
                debugInfo.put("recipe_count", count);
            } catch (Exception e) {
                debugInfo.put("recipe_table", "Failed: " + e.getMessage());
                logger.error("Recipe table test failed", e);
            }

            // Try to get recipe IDs directly
            debugInfo.put("recipe_ids", "Testing...");
            try {
                List<Long> ids = jdbcTemplate.queryForList("SELECT id FROM recipe LIMIT 10", Long.class);
                debugInfo.put("recipe_ids", ids.isEmpty() ? "No IDs found" : ids);
            } catch (Exception e) {
                debugInfo.put("recipe_ids", "Failed: " + e.getMessage());
                logger.error("Recipe IDs query failed", e);
            }

            // Try repository count
            debugInfo.put("repository_count", "Testing...");
            try {
                long count = recipeRepository.count();
                debugInfo.put("repository_count", count);
            } catch (Exception e) {
                debugInfo.put("repository_count", "Failed: " + e.getMessage());
                logger.error("Repository count failed", e);
            }

            // Try repository findAll
            debugInfo.put("repository_findAll", "Testing...");
            try {
                List<Recipe> recipes = recipeRepository.findAll();
                debugInfo.put("repository_findAll_size", recipes.size());
                if (!recipes.isEmpty()) {
                    debugInfo.put("repository_findAll_first_recipe", recipes.get(0).getId() + ": " + recipes.get(0).getName());
                }
            } catch (Exception e) {
                debugInfo.put("repository_findAll", "Failed: " + e.getMessage());
                logger.error("Repository findAll failed", e);
            }

            return new ResponseEntity<>(debugInfo, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in debugRecipes: {}", e.getMessage(), e);
            debugInfo.put("error", e.getMessage());
            return new ResponseEntity<>(debugInfo, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
