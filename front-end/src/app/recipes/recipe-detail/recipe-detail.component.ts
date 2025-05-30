import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  isInMyRecipes: boolean = false;
  isPersonal: boolean;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
        this.isPersonal =  this.recipe.isPersonal;
        if (!this.recipe) {
          this.router.navigate(['/recipe-book']);
        } else {
          this.isInMyRecipes = this.recipeService.isInMyRecipes(this.recipe);
        }
      }
    );
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    if (this.recipe.isPersonal) {
      this.router.navigate(['edit'], {relativeTo: this.route});
    }
  }

  onDeleteRecipe() {
    if (this.recipe.isPersonal) {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes']);
    }
  }

  onToggleFavorite() {
    if (!this.recipe.isPersonal) {
      if (this.isInMyRecipes) {
        this.recipeService.removeFromMyRecipes(this.recipe);
      } else {
        this.recipeService.addToMyRecipes(this.recipe);
      }
      this.isInMyRecipes = !this.isInMyRecipes;
    }
  }
}
