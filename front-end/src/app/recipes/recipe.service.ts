import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { MealCategory } from '../shared/enums/meal-category.enum';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // Breakfast Recipes
    new Recipe(
      'Classic Pancakes',
      'Fluffy pancakes served with maple syrup and butter',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3',
      [
        new Ingredient('Flour', 2),
        new Ingredient('Eggs', 2),
        new Ingredient('Milk', 1),
        new Ingredient('Maple Syrup', 1)
      ],
      MealCategory.BREAKFAST
    ),
    new Recipe(
      'Avocado Toast',
      'Healthy breakfast with mashed avocado on sourdough bread',
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3',
      [
        new Ingredient('Avocado', 1),
        new Ingredient('Bread Slice', 2),
        new Ingredient('Cherry Tomatoes', 5),
        new Ingredient('Eggs', 2)
      ],
      MealCategory.BREAKFAST
    ),
    
    // Lunch Recipes
    new Recipe(
      'Caesar Salad',
      'Classic caesar salad with homemade dressing and croutons',
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3',
      [
        new Ingredient('Romaine Lettuce', 1),
        new Ingredient('Parmesan Cheese', 1),
        new Ingredient('Croutons', 1),
        new Ingredient('Chicken Breast', 1)
      ],
      MealCategory.LUNCH
    ),
    new Recipe(
      'Grilled Cheese Sandwich',
      'Ultimate comfort food with melted cheese and crispy bread',
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3',
      [
        new Ingredient('Bread Slices', 2),
        new Ingredient('Cheddar Cheese', 2),
        new Ingredient('Butter', 1)
      ],
      MealCategory.LUNCH
    ),

    // Dinner Recipes
    new Recipe(
      'Spaghetti Carbonara',
      'Classic Italian pasta with creamy egg sauce and pancetta',
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3',
      [
        new Ingredient('Spaghetti', 1),
        new Ingredient('Eggs', 2),
        new Ingredient('Pancetta', 1),
        new Ingredient('Parmesan Cheese', 1)
      ],
      MealCategory.DINNER
    ),
    new Recipe(
      'Grilled Salmon',
      'Fresh salmon fillet with lemon and herbs',
      'https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3',
      [
        new Ingredient('Salmon Fillet', 2),
        new Ingredient('Lemon', 1),
        new Ingredient('Fresh Herbs', 1),
        new Ingredient('Olive Oil', 1)
      ],
      MealCategory.DINNER
    ),

    // Dessert Recipes
    new Recipe(
      'Chocolate Brownie',
      'Rich and fudgy brownies with chocolate chips',
      'https://images.unsplash.com/photo-1515037893149-de7f840978e2?ixlib=rb-4.0.3',
      [
        new Ingredient('Dark Chocolate', 2),
        new Ingredient('Butter', 1),
        new Ingredient('Eggs', 3),
        new Ingredient('Flour', 1)
      ],
      MealCategory.DESSERT
    ),
    new Recipe(
      'Apple Pie',
      'Classic American apple pie with flaky crust',
      'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?ixlib=rb-4.0.3',
      [
        new Ingredient('Apples', 6),
        new Ingredient('Pie Crust', 2),
        new Ingredient('Cinnamon', 1),
        new Ingredient('Sugar', 1)
      ],
      MealCategory.DESSERT
    )
  ];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipesByCategory(category: MealCategory | null) {
    if (!category) {
      return this.getRecipes();
    }
    return this.recipes.filter(recipe => recipe.category === category);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
