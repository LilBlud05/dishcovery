export interface IngredientItem {
  ingredient: string;
  measure: string;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strTags?: string;
  previewSummary?: string;
}

export interface MealDetail extends MealSummary {
  strInstructions: string;
  strYoutube?: string;
  strSource?: string;
  ingredients: IngredientItem[];
  steps: string[];
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface RawMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string | null;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strMealThumb: string;
  strTags?: string | null;
  strYoutube?: string | null;
  strSource?: string | null;
  [key: string]: string | null | undefined;
}

export interface MealDbMealsResponse {
  meals: RawMeal[] | null;
}

export interface MealDbCategoriesResponse {
  categories: Category[] | null;
}