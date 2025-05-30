import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeEditGuard implements CanActivate {
  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = +route.params['id'];
    
    // If it's a new recipe (no id), allow access
    if (!id) {
      return true;
    }
    
    const recipe = this.recipeService.getRecipe(id);
    
    // Check if recipe exists and is personal
    if (recipe && recipe.isPersonal) {
      return true;
    }

    // If recipe is collected or doesn't exist, navigate back to recipes
    this.router.navigate(['/my-recipes']);
    return false;
  }
}
