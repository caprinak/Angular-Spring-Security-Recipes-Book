import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public id?: number;  // Optional ID field
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public category: string;
  public isPersonal: boolean; // Track if this is a personal recipe or collected one

  constructor(
    name: string, 
    desc: string, 
    imagePath: string, 
    ingredients: Ingredient[], 
    category: string = 'BREAKFAST',
    isPersonal: boolean = false
  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.category = category;
    this.isPersonal = isPersonal;
  }
}
