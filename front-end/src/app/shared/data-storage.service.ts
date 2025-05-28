import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, take, exhaustMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}
  addRecipes(recipes: Recipe[]) {
    // Let the AuthInterceptor handle the token
    return this.http
      .post<Recipe[]>(
        `${this.baseUrl}/batch/recipes`,
        recipes
      ).pipe(
        tap(response => {
          console.log('All recipes saved successfully:', response);
        }),
        catchError(error => {
          console.error('Error saving recipes:', error);
          return throwError(() => new Error('Failed to save recipes'));
        })
      );
  }


  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // Let the AuthInterceptor handle the token
    return this.http
      .put<Recipe[]>(
        `${this.baseUrl}/batch/recipes`,
        recipes
      ).pipe(
        tap(response => {
          console.log('Store recipes response:', response);
        }),
        catchError(error => {
          console.error('Store recipes error:', error);
          return throwError(() => new Error('Failed to store recipes'));
        })
      );
  }

  fetchRecipes() {
    // Let the AuthInterceptor handle the token
    return this.http
      .get<Recipe[]>(`${this.baseUrl}/batch/recipes`)
      .pipe(
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
