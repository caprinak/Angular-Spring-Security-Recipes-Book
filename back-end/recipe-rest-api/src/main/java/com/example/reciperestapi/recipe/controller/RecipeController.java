package com.example.reciperestapi.recipe.controller;

import com.example.reciperestapi.recipe.dao.RecipeRepository;
import com.example.reciperestapi.recipe.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RecipeController {

    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
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
        List<Recipe> allRecipes = recipeRepository.findAll();
        return new ResponseEntity<>(allRecipes, HttpStatus.OK);
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
}
