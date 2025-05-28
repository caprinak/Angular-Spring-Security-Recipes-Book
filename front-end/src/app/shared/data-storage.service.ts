import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

interface SpringDataResponse {
  _embedded: {
    recipes: Recipe[];
  };
}

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .post(
        `${this.baseUrl}/batch/recipes`,
        recipes
      )
      .pipe(
        tap(response => {
          console.log('Store recipes response:', response);
        }),
        catchError(error => {
          console.error('Store recipes error:', error);
          return throwError(() => new Error('Failed to store recipes'));
        })
      )
      .subscribe(
        response => {
          console.log('Recipes stored successfully:', response);
        },
        error => {
          console.error('Error storing recipes:', error);
        }
      );
  }

  fetchRecipes() {
    return this.http
      .get<SpringDataResponse>(
        'http://localhost:8080/api/recipes'
      )
      .pipe(
        tap(response => {
          console.log('API Response:', response);
        }),
        map(response => response._embedded.recipes),
        map(recipes => {
          return recipes.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }));
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }),
        catchError(error => {
          console.error('Error fetching recipes:', error);
          return throwError(() => new Error('Could not fetch recipes'));
        })
      );
  }
}
