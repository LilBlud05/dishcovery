import {
  Category,
  IngredientItem,
  MealDbCategoriesResponse,
  MealDbMealsResponse,
  MealDetail,
  MealSummary,
  RawMeal,
} from '@/types/meal';

const BASE_URL =
  process.env.NEXT_PUBLIC_MEALDB_BASE_URL?.replace(/\/$/, '') ||
  'https://www.themealdb.com/api/json/v1/1';

/**
 * Normalizes TheMealDB's 40 flattened ingredient/measurement keys
 * (strIngredient1..20 & strMeasure1..20) into a clean array.
 */
export function normalizeIngredients(raw: RawMeal): IngredientItem[] {
  const ingredients: IngredientItem[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = raw[`strIngredient${i}`]?.trim();
    const measure = raw[`strMeasure${i}`]?.trim() || '';

    if (ingredient) {
      ingredients.push({
        ingredient,
        measure: measure || 'To taste',
      });
    }
  }

  return ingredients;
}

/**
 * Parses raw instruction strings into clean, step-by-step arrays.
 */
export function parseInstructions(rawInstructions?: string | null): string[] {
  if (!rawInstructions) return [];

  const normalized = rawInstructions.replace(/\r\n/g, '\n').trim();

  let lines = normalized
    .split(/\n+/)
    .map((line) => line.replace(/^(step\s*\d+[:.)\-]?\s*|\d+[:.)\-]\s+)/i, '').trim())
    .filter((line) => line.length > 2);

  if (lines.length <= 1 && normalized.length > 180) {
    lines = normalized
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 2);
  }

  return lines;
}

function buildPreviewSummary(raw: RawMeal): string | undefined {
  if (!raw.strInstructions) return undefined;
  const cleaned = raw.strInstructions.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned.length > 110 ? `${cleaned.slice(0, 107).trim()}...` : cleaned;
}

export function mapRawMealToSummary(raw: RawMeal, fallbackCategory?: string): MealSummary {
  return {
    idMeal: raw.idMeal,
    strMeal: raw.strMeal,
    strMealThumb: raw.strMealThumb,
    strCategory: raw.strCategory || fallbackCategory || undefined,
    strArea: raw.strArea || undefined,
    strTags: raw.strTags || undefined,
    previewSummary: buildPreviewSummary(raw),
  };
}

export function mapRawMealToDetail(raw: RawMeal): MealDetail {
  return {
    ...mapRawMealToSummary(raw),
    strInstructions: raw.strInstructions?.trim() || '',
    strYoutube: raw.strYoutube?.trim() || undefined,
    strSource: raw.strSource?.trim() || undefined,
    ingredients: normalizeIngredients(raw),
    steps: parseInstructions(raw.strInstructions),
  };
}

async function fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`TheMealDB API error (${response.status}): ${response.statusText}`);
  }

  return (await response.json()) as T;
}

/**
 * Fetches an initial batch of full meal records for the Explore Feed.
 */
export async function getInitialMeals(): Promise<MealSummary[]> {
  try {
    const data = await fetchJson<MealDbMealsResponse>('/search.php?s=', {
      next: { revalidate: 3600 },
    });
    if (!data.meals) return [];
    return data.meals.map((meal) => mapRawMealToSummary(meal));
  } catch (error) {
    console.error('Failed to fetch initial meals:', error);
    throw error;
  }
}

/**
 * Searches meals by keyword or dish name.
 */
export async function searchMeals(query: string): Promise<MealSummary[]> {
  try {
    const trimmed = query.trim();
    const data = await fetchJson<MealDbMealsResponse>(
      `/search.php?s=${encodeURIComponent(trimmed)}`,
      { cache: 'no-store' }
    );
    if (!data.meals) return [];
    return data.meals.map((meal) => mapRawMealToSummary(meal));
  } catch (error) {
    console.error(`Failed to search meals for "${query}":`, error);
    throw error;
  }
}

/**
 * Retrieves all culinary categories.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchJson<MealDbCategoriesResponse>('/categories.php', {
      next: { revalidate: 86400 },
    });
    return data.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

/**
 * Filters meals by category name.
 */
export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  try {
    const data = await fetchJson<MealDbMealsResponse>(
      `/filter.php?c=${encodeURIComponent(category)}`,
      { next: { revalidate: 3600 } }
    );
    if (!data.meals) return [];
    return data.meals.map((meal) => mapRawMealToSummary(meal, category));
  } catch (error) {
    console.error(`Failed to fetch meals for category "${category}":`, error);
    throw error;
  }
}

/**
 * Looks up a complete recipe by meal ID.
 */
export async function getMealById(id: string): Promise<MealDetail | null> {
  try {
    const data = await fetchJson<MealDbMealsResponse>(
      `/lookup.php?i=${encodeURIComponent(id)}`,
      { next: { revalidate: 3600 } }
    );
    if (!data.meals || data.meals.length === 0) return null;
    return mapRawMealToDetail(data.meals[0]);
  } catch (error) {
    console.error(`Failed to fetch meal by ID "${id}":`, error);
    throw error;
  }
}

/**
 * Fetches a single random meal (always uncached).
 */
export async function getRandomMeal(): Promise<MealDetail | null> {
  try {
    const data = await fetchJson<MealDbMealsResponse>('/random.php', {
      cache: 'no-store',
    });
    if (!data.meals || data.meals.length === 0) return null;
    return mapRawMealToDetail(data.meals[0]);
  } catch (error) {
    console.error('Failed to fetch random meal:', error);
    throw error;
  }
}