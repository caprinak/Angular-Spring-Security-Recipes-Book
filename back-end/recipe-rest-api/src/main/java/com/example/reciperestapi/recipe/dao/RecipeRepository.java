package com.example.reciperestapi.recipe.dao;

import com.example.reciperestapi.recipe.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "recipes", path = "recipes")
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    // You get basic CRUD operations by default
    // Additional custom queries can be added here

    // Find recipes by name containing the given string (case-insensitive)
    List<Recipe> findByNameContainingIgnoreCase(String name);

    // Find recipes by description containing the given string (case-insensitive)
    List<Recipe> findByDescriptionContainingIgnoreCase(String description);
}