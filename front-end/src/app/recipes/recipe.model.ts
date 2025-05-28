import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public category: string;

  constructor(
    name: string, 
    desc: string, 
    imagePath: string, 
    ingredients: Ingredient[], 
    category: string = 'BREAKFAST'
  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.category = category;
  }
}
