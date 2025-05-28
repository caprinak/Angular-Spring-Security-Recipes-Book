import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { MealCategory } from '../shared/enums/meal-category.enum';
import { MeasurementUnit } from '../shared/enums/measurement-unit.enum';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit, OnDestroy {
  categories = Object.values(MealCategory);
  selectedCategory = 'ALL';
  feedRecipes: Recipe[] = [];
  private subscriptions = new Subscription();

  constructor(
   
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const dummyRecipes = [
      // Breakfast Recipes
      new Recipe(
        'Classic Pancakes',
        'Fluffy pancakes with maple syrup',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
        [
          new Ingredient('Flour', 2, MeasurementUnit.CUP),
          new Ingredient('Eggs', 2, MeasurementUnit.WHOLE),
          new Ingredient('Milk', 1, MeasurementUnit.CUP)
        ],
        MealCategory.BREAKFAST
      ),
      new Recipe(
        'Avocado Toast',
        'Creamy avocado on toasted sourdough',
        'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d',
        [
          new Ingredient('Avocado', 1, MeasurementUnit.WHOLE),
          new Ingredient('Bread', 2, MeasurementUnit.SLICE),
          new Ingredient('Cherry Tomatoes', 4, MeasurementUnit.WHOLE)
        ],
        MealCategory.BREAKFAST
      ),
      new Recipe(
        'Eggs Benedict',
        'Poached eggs with hollandaise sauce',
        'https://images.unsplash.com/photo-1608039829572-78524f79c4c7',
        [
          new Ingredient('Eggs', 4, MeasurementUnit.WHOLE),
          new Ingredient('English Muffins', 2, MeasurementUnit.PIECE),
          new Ingredient('Ham', 2, MeasurementUnit.SLICE)
        ],
        MealCategory.BREAKFAST
      ),
      new Recipe(
        'Fruit Smoothie Bowl',
        'Refreshing blend topped with granola',
        'https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2',
        [
          new Ingredient('Mixed Berries', 2, MeasurementUnit.CUP),
          new Ingredient('Banana', 1, MeasurementUnit.WHOLE),
          new Ingredient('Granola', 1, MeasurementUnit.CUP)
        ],
        MealCategory.BREAKFAST
      ),

      // Lunch Recipes
      new Recipe(
        'Caesar Salad',
        'Fresh salad with homemade dressing',
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        [
          new Ingredient('Lettuce', 1, MeasurementUnit.WHOLE),
          new Ingredient('Croutons', 1, MeasurementUnit.CUP),
          new Ingredient('Parmesan', 1, MeasurementUnit.CUP)
        ],
        MealCategory.LUNCH
      ),
      new Recipe(
        'Caprese Sandwich',
        'Italian-style sandwich with fresh mozzarella',
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
        [
          new Ingredient('Ciabatta Bread', 1, MeasurementUnit.PIECE),
          new Ingredient('Mozzarella', 1, MeasurementUnit.CUP),
          new Ingredient('Tomatoes', 2, MeasurementUnit.WHOLE)
        ],
        MealCategory.LUNCH
      ),
      new Recipe(
        'Quinoa Buddha Bowl',
        'Healthy bowl with roasted vegetables',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        [
          new Ingredient('Quinoa', 1, MeasurementUnit.CUP),
          new Ingredient('Sweet Potato', 1, MeasurementUnit.WHOLE),
          new Ingredient('Chickpeas', 1, MeasurementUnit.CUP)
        ],
        MealCategory.LUNCH
      ),
      new Recipe(
        'Asian Noodle Salad',
        'Cold noodles with sesame dressing',
        'https://images.unsplash.com/photo-1547928576-965be7f5d7ae',
        [
          new Ingredient('Rice Noodles', 2, MeasurementUnit.CUP),
          new Ingredient('Bell Peppers', 2, MeasurementUnit.WHOLE),
          new Ingredient('Sesame Seeds', 1, MeasurementUnit.TABLESPOON)
        ],
        MealCategory.LUNCH
      ),

      // Dinner Recipes
      new Recipe(
        'Grilled Salmon',
        'With lemon herb butter',
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        [
          new Ingredient('Salmon Fillet', 2, MeasurementUnit.PIECE),
          new Ingredient('Lemon', 1, MeasurementUnit.WHOLE),
          new Ingredient('Fresh Herbs', 1, MeasurementUnit.TABLESPOON)
        ],
        MealCategory.DINNER
      ),
      new Recipe(
        'Beef Stir Fry',
        'Quick and flavorful Asian-style stir fry',
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
        [
          new Ingredient('Beef Strips', 2, MeasurementUnit.POUND),
          new Ingredient('Mixed Vegetables', 3, MeasurementUnit.CUP),
          new Ingredient('Rice', 2, MeasurementUnit.CUP)
        ],
        MealCategory.DINNER
      ),
      new Recipe(
        'Chicken Parmesan',
        'Classic Italian comfort food',
        'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8',
        [
          new Ingredient('Chicken Breast', 2, MeasurementUnit.PIECE),
          new Ingredient('Mozzarella', 1, MeasurementUnit.CUP),
          new Ingredient('Tomato Sauce', 1, MeasurementUnit.CUP)
        ],
        MealCategory.DINNER
      ),
      new Recipe(
        'Vegetable Lasagna',
        'Layered pasta with ricotta and vegetables',
        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
        [
          new Ingredient('Lasagna Noodles', 1, MeasurementUnit.PIECE),
          new Ingredient('Ricotta', 2, MeasurementUnit.CUP),
          new Ingredient('Spinach', 2, MeasurementUnit.CUP)
        ],
        MealCategory.DINNER
      ),

      // Snack Recipes
      new Recipe(
        'Hummus Platter',
        'Homemade hummus with pita and vegetables',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
        [
          new Ingredient('Chickpeas', 2, MeasurementUnit.CUP),
          new Ingredient('Tahini', 1, MeasurementUnit.TABLESPOON),
          new Ingredient('Pita Bread', 2, MeasurementUnit.PIECE)
        ],
        MealCategory.SNACK
      ),
      new Recipe(
        'Trail Mix',
        'Energy-packed nuts and dried fruits',
        'https://images.unsplash.com/photo-1556855810-ac404aa91e85',
        [
          new Ingredient('Mixed Nuts', 2, MeasurementUnit.CUP),
          new Ingredient('Dried Cranberries', 1, MeasurementUnit.CUP),
          new Ingredient('Dark Chocolate', 1, MeasurementUnit.CUP)
        ],
        MealCategory.SNACK
      ),

      // Dessert Recipes
      new Recipe(
        'Chocolate Lava Cake',
        'Warm chocolate cake with molten center',
        'https://images.unsplash.com/photo-1602351447937-745cb720612f',
        [
          new Ingredient('Dark Chocolate', 2, MeasurementUnit.CUP),
          new Ingredient('Butter', 1, MeasurementUnit.CUP),
          new Ingredient('Eggs', 2, MeasurementUnit.WHOLE)
        ],
        MealCategory.DESSERT
      ),
      new Recipe(
        'Apple Pie',
        'Classic American dessert',
        'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2',
        [
          new Ingredient('Apples', 6, MeasurementUnit.WHOLE),
          new Ingredient('Pie Crust', 2, MeasurementUnit.PIECE),
          new Ingredient('Cinnamon', 1, MeasurementUnit.TEASPOON)
        ],
        MealCategory.DESSERT
      ),
      new Recipe(
        'Tiramisu',
        'Italian coffee-flavored dessert',
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        [
          new Ingredient('Ladyfingers', 2, MeasurementUnit.PIECE),
          new Ingredient('Mascarpone', 2, MeasurementUnit.CUP),
          new Ingredient('Coffee', 1, MeasurementUnit.CUP)
        ],
        MealCategory.DESSERT
      ),
      new Recipe(
        'Berry Cheesecake',
        'Creamy cheesecake with fresh berries',
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
        [
          new Ingredient('Cream Cheese', 3, MeasurementUnit.CUP),
          new Ingredient('Mixed Berries', 2, MeasurementUnit.CUP),
          new Ingredient('Graham Crackers', 1, MeasurementUnit.CUP)
        ],
        MealCategory.DESSERT
      ),
      new Recipe(
        'Ice Cream Sundae',
        'Classic dessert with multiple toppings',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
        [
          new Ingredient('Vanilla Ice Cream', 2, MeasurementUnit.CUP),
          new Ingredient('Hot Fudge', 1, MeasurementUnit.CUP),
          new Ingredient('Whipped Cream', 1, MeasurementUnit.CUP),
          new Ingredient('Cherry', 1, MeasurementUnit.WHOLE)
        ],
        MealCategory.DESSERT
      ),
      new Recipe(
        'Fruit Tart',
        'Buttery pastry with fresh fruits',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777',
        [
          new Ingredient('Pastry Cream', 1, MeasurementUnit.CUP),
          new Ingredient('Mixed Fruits', 2, MeasurementUnit.CUP),
          new Ingredient('Tart Shell', 1, MeasurementUnit.PIECE)
        ],
        MealCategory.DESSERT
      )
    ];
    this.feedRecipes = dummyRecipes;
    }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSelectCategory(category: string) {
    this.selectedCategory = category;
    this.filterRecipes();
  }

  filterRecipes(feedRecipes: Recipe[] = []) {
    const recipes = feedRecipes; // Replace with this.recipeService.getRecipes() in a real application
    this.feedRecipes = this.selectedCategory === 'ALL'
      ? recipes
      : recipes.filter(recipe => recipe.category === this.selectedCategory);
  }

  onNewRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onSaveAll() {
    this.subscriptions.add(
      this.dataStorageService.addRecipes(this.feedRecipes)
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
