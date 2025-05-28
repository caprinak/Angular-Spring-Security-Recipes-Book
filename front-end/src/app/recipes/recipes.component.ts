import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { MealCategory } from '../shared/enums/meal-category.enum';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  filteredRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.filteredRecipes = this.recipeService.getRecipes();
  }

  onCategorySelected(category: MealCategory | null) {
    this.filteredRecipes = this.recipeService.getRecipesByCategory(category);
  }
}
