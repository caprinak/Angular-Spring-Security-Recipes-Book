import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { MealCategory } from '../../shared/enums/meal-category.enum';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  @Input() recipes: Recipe[];
  filteredRecipes: Recipe[];
  private _allRecipes: Recipe[];
  subscription: Subscription;
  categories = Object.values(MealCategory);
  selectedCategories: Set<string> = new Set();
  showNewButton: boolean = false;
  
  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    // Check if we're in the my-recipes section
    this.showNewButton = this.router.url.includes('/my-recipes');

    if (!this.recipes) {
      this.subscription = this.recipeService.recipesChanged
        .subscribe(
          (recipes: Recipe[]) => {
            this._allRecipes = recipes;
            this.recipes = recipes;
            this.filterRecipes();
          }
        );
      this._allRecipes = this.recipeService.getRecipes();
      this.recipes = this._allRecipes;
    } else {
      this._allRecipes = this.recipes;
    }
    this.filterRecipes();
  }

  onCategoryChange(category: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedCategories.add(category);
    } else {
      this.selectedCategories.delete(category);
    }
    this.filterRecipes();
  }

  filterRecipes() {
    if (this.selectedCategories.size === 0 || this.selectedCategories.has('ALL')) {
      this.recipes = this._allRecipes;
    } else {
      this.recipes = this._allRecipes.filter(recipe =>
        this.selectedCategories.has(recipe.category)
      );
    }
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
