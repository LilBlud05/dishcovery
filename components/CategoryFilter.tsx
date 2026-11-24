'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Category } from '@/types/meal';

const CATEGORY_EMOJI: Record<string, string> = {
  Beef: '🥩',
  Chicken: '🍗',
  Dessert: '🍰',
  Lamb: '🍖',
  Miscellaneous: '🍽️',
  Pasta: '🍝',
  Pork: '🥓',
  Seafood: '🐟',
  Side: '🥗',
  Starter: '🥟',
  Vegan: '🌱',
  Vegetarian: '🥦',
  Breakfast: '🥐',
  Goat: '🍲',
};

export type SortOption = 'featured' | 'az' | 'za';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-3 border-y border-stone-200/80 py-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Scrollable Category Pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Recipe categories"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'All'}
          onClick={() => onSelectCategory('All')}
          className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            activeCategory === 'All'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-100'
          }`}
        >
          All Dishes
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.strCategory;
          const emoji = CATEGORY_EMOJI[cat.strCategory] || '🍴';

          return (
            <button
              key={cat.idCategory}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.strCategory)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-100'
              }`}
            >
              <span aria-hidden="true">{emoji}</span>
              <span>{cat.strCategory}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Selector */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <label
          htmlFor="sort-recipes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500"
        >
          <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sorted by:</span>
        </label>
        <select
          id="sort-recipes"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/15"
        >
          <option value="featured">All Recipes</option>
          <option value="az">Name (A–Z)</option>
          <option value="za">Name (Z–A)</option>
        </select>
      </div>
    </div>
  );
}