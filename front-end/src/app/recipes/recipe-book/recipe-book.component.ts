import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { MealCategory } from '../../shared/enums/meal-category.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  categories = Object.values(MealCategory);
  selectedCategory: string | null = null;
  private subscription: Subscription;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.filteredRecipes = this.recipes;
    
    this.subscription = this.recipeService.recipesChanged.subscribe(
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

  toggleFavorite(recipe: Recipe, event: Event) {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent event bubbling
    
    if (this.recipeService.isInMyRecipes(recipe)) {
      this.recipeService.removeFromMyRecipes(recipe);
    } else {
      this.recipeService.addToMyRecipes(recipe);
    }
  }

  isInMyRecipes(recipe: Recipe): boolean {
    return this.recipeService.isInMyRecipes(recipe);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
