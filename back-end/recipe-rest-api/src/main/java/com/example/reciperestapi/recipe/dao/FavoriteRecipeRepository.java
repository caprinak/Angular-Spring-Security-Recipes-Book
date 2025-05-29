package com.example.reciperestapi.recipe.dao;

import com.example.reciperestapi.auth.model.User;
import com.example.reciperestapi.recipe.model.FavoriteRecipe;
import com.example.reciperestapi.recipe.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRecipeRepository extends JpaRepository<FavoriteRecipe, Long> {
    
    /**
     * Find all favorite recipes for a specific user
     * @param user the user
     * @return list of favorite recipes
     */
    List<FavoriteRecipe> findByUser(User user);
    
    /**
     * Find all users who favorited a specific recipe
     * @param recipe the recipe
     * @return list of favorite recipes
     */
    List<FavoriteRecipe> findByRecipe(Recipe recipe);
    
    /**
     * Check if a recipe is favorited by a specific user
     * @param user the user
     * @param recipe the recipe
     * @return the favorite recipe if found
     */
    Optional<FavoriteRecipe> findByUserAndRecipe(User user, Recipe recipe);
    
    /**
     * Delete a favorite recipe for a specific user and recipe
     * @param user the user
     * @param recipe the recipe
     */
    void deleteByUserAndRecipe(User user, Recipe recipe);
}