import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit, OnDestroy {
  categories = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER', 'DESSERT'];
  selectedCategory = 'ALL';
  filteredRecipes: Recipe[] = [];
  private subscriptions = new Subscription();

  constructor(
    private recipeService: RecipeService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to recipe changes
    this.subscriptions.add(
      this.recipeService.recipesChanged.subscribe(() => {
        this.filterRecipes();
      })
    );

    // First try to fetch existing recipes
    this.subscriptions.add(
      this.dataStorageService.fetchRecipes()
        .subscribe({
          next: () => {
            const dummyRecipes = [
              new Recipe(
                'Classic Pancakes',
                'Fluffy pancakes with maple syrup',
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
                [
                  new Ingredient('Flour', 2),
                  new Ingredient('Eggs', 2),
                  new Ingredient('Milk', 1)
                ],
                'BREAKFAST'
              ),
              new Recipe(
                'Caesar Salad',
                'Fresh salad with homemade dressing',
                'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
                [
                  new Ingredient('Lettuce', 1),
                  new Ingredient('Croutons', 1),
                  new Ingredient('Parmesan', 1)
                ],
                'LUNCH'
              )
            ];
            this.recipeService.setRecipes(dummyRecipes);
            this.filterRecipes();
          },
          error: () => {
            // If fetching fails, initialize with dummy data
            
            this.filterRecipes();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSelectCategory(category: string) {
    this.selectedCategory = category;
    this.filterRecipes();
  }

  filterRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.filteredRecipes = this.selectedCategory === 'ALL'
      ? recipes
      : recipes.filter(recipe => recipe.category === this.selectedCategory);
  }

  onNewRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onSaveAll() {
    this.subscriptions.add(
      this.dataStorageService.storeRecipes()
        .subscribe({
          next: (response) => {
            console.log('All recipes saved successfully:', response);
          },
          error: (error) => {
            console.error('Error saving recipes:', error);
          }
        })
    );
  }

  onFetchRecipes() {
    this.subscriptions.add(
      this.dataStorageService.fetchRecipes()
        .subscribe({
          next: () => {
            console.log('Recipes fetched successfully');
            this.filterRecipes();
          },
          error: (error) => {
            console.error('Error fetching recipes:', error);
          }
        })
    );
  }
}
