import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { MealCategory } from '../../shared/enums/meal-category.enum';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit, OnDestroy {
  myRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  categories = Object.values(MealCategory);
  selectedCategory: string | null = null;
  private subscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.myRecipes = this.recipeService.getMyRecipes();
    this.filteredRecipes = this.myRecipes;
    
    this.subscription = this.recipeService.myRecipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.myRecipes = recipes;
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
      ? this.myRecipes.filter(recipe => recipe.category === this.selectedCategory)
      : this.myRecipes;
  }

  removeFromFavorites(recipe: Recipe, event: Event) {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent event bubbling
    this.recipeService.removeFromMyRecipes(recipe);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
