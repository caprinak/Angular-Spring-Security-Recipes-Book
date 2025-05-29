import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { MealCategory } from '../../shared/enums/meal-category.enum';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  categories = Object.values(MealCategory);
  selectedCategory: string | null = null;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.filteredRecipes = this.recipes;
    this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        this.filterRecipes();
      }
    );
  }

  onFilterCategory(category: string) {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.filterRecipes();
  }

  private filterRecipes() {
    this.filteredRecipes = this.selectedCategory
      ? this.recipes.filter(recipe => recipe.category === this.selectedCategory)
      : this.recipes;
  }
}
