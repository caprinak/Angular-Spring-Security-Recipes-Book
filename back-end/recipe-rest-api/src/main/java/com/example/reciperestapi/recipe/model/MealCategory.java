package com.example.reciperestapi.recipe.model;

public enum MealCategory {
    BREAKFAST("Breakfast"),
    LUNCH("Lunch"),
    DINNER("Dinner"),
    DESSERT("Dessert"),
    SNACK("Snack"),
    OTHER("Other");

    private final String displayName;

    MealCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}