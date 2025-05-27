package com.example.reciperestapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.reciperestapi.recipe.model", "com.example.reciperestapi.auth.model"})
@EnableJpaRepositories(basePackages = {"com.example.reciperestapi.recipe.dao", "com.example.reciperestapi.auth.repository"})
@ComponentScan(basePackages = {"com.example.reciperestapi"})
public class RecipeRestApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeRestApiApplication.class, args);
    }
}
