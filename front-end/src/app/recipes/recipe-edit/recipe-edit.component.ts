import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { MealCategory } from '../../shared/enums/meal-category.enum';
import { MeasurementUnit } from '../../shared/enums/measurement-unit.enum';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  measurementUnits = Object.values(MeasurementUnit);
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  categories = Object.values(MealCategory);

  get recipeControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  onSubmit() {
    const formValue = this.recipeForm.value;
    const recipe = {
      ...formValue,
      id: this.id
    };

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, recipe);
    } else {
      this.recipeService.addRecipe(recipe);
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
        unitOfMeasurement: new FormControl('units', Validators.required)
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  private initForm() {    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeCategory = null;
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      recipeCategory = (recipe.category as MealCategory)
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ]),
              unitOfMeasurement: new FormControl(ingredient.unitOfMeasurement || 'units', Validators.required)
            })
          );
        }
      }
    }    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      category: new FormControl(recipeCategory || '', Validators.required),
      ingredients: recipeIngredients
    });
  }
}
