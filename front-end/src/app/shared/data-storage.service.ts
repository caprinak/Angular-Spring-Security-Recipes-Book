import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, take, exhaustMap } from 'rxjs/operators';
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
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated'));
        }

        // Debug log to verify token
        console.log('Using token:', user.token);

        return this.http
          .put(
            `${this.baseUrl}/batch/recipes`,
            recipes,
            {
              headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`)
            }
          )          .pipe(
            tap(response => {
              console.log('Store recipes response:', response);
            }),
            catchError(error => {
              console.error('Store recipes error:', error);
              return throwError(() => new Error('Failed to store recipes'));
            })
          );
      })
    );
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated'));
        }
        return this.http
          .get<SpringDataResponse>(
            `${this.baseUrl}/recipes`,
            {
              headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`)
            }
          );
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
