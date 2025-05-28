import { Component, EventEmitter, Output } from '@angular/core';
import { MealCategory } from '../../shared/enums/meal-category.enum';

@Component({
  selector: 'app-recipe-category-filter',
  templateUrl: './recipe-category-filter.component.html',
  styleUrls: ['./recipe-category-filter.component.css']
})
export class RecipeCategoryFilterComponent {
  categories = Object.values(MealCategory);
  selectedCategory: MealCategory | null = null;
  @Output() categorySelected = new EventEmitter<MealCategory | null>();

  onCategorySelect(category: MealCategory): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
      this.categorySelected.emit(null);
    } else {
      this.selectedCategory = category;
      this.categorySelected.emit(category);
    }
  }

  isSelected(category: MealCategory): boolean {
    return this.selectedCategory === category;
  }
}
