import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  myRecipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  private myRecipes: Recipe[] = [];
  private nextId = 1;

  constructor(private slService: ShoppingListService) {}
  
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes.map(recipe => {
      if (!recipe.id) {
        recipe.id = this.nextId++;
      }
      // Set collected recipes as non-personal by default
      recipe.isPersonal = false;
      return recipe;
    });
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.nextId++;
    recipe.isPersonal = true; // New recipes created by user are personal
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: number, newRecipe: Recipe) {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      newRecipe.id = id;
      // Preserve the original isPersonal status
      newRecipe.isPersonal = this.recipes[index].isPersonal;
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }
  }

  deleteRecipe(id: number) {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }
  }

  getMyRecipes() {
    return this.myRecipes.slice();
  }

  addToMyRecipes(recipe: Recipe) {
    // Only allow adding collected (non-personal) recipes to favorites
    if (!recipe.isPersonal) {
      const exists = this.myRecipes.some(r => r.id === recipe.id);
      if (!exists) {
        this.myRecipes.push({...recipe});
        this.myRecipesChanged.next(this.myRecipes.slice());
      }
    }
  }

  removeFromMyRecipes(recipe: Recipe) {
    const index = this.myRecipes.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      this.myRecipes.splice(index, 1);
      this.myRecipesChanged.next(this.myRecipes.slice());
    }
  }

  isInMyRecipes(recipe: Recipe): boolean {
    return this.myRecipes.some(r => r.id === recipe.id);
  }
}
