import { Ingredient } from '../shared/ingredient.model';
import { MealCategory } from '../shared/enums/meal-category.enum';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public category: MealCategory;

  constructor(
    name: string,
    desc: string,
    imagePath: string,
    ingredients: Ingredient[],
    category: MealCategory = MealCategory.OTHER
  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.category = category;
  }
}
