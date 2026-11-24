'use client';

import React from 'react';
import { Bookmark, Printer } from 'lucide-react';
import { MealSummary } from '@/types/meal';
import { useCookbook } from './CookbookProvider';

export function RecipeDetailActions({ meal }: { meal: MealSummary }) {
  const { isSaved, toggleSave, hydrated } = useCookbook();
  const saved = hydrated && isSaved(meal.idMeal);

  return (
    <div className="flex flex-wrap items-center gap-2.5 print:hidden">
      <button
        type="button"
        onClick={() => toggleSave(meal)}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/25 ${
          saved
            ? 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100/80'
            : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50'
        }`}
      >
        <Bookmark
          className={`h-4 w-4 ${saved ? 'fill-orange-600 text-orange-600' : 'text-orange-600'}`}
          aria-hidden="true"
        />
        <span>{saved ? 'Saved to Cookbook' : 'Save to Cookbook'}</span>
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        aria-label="Print recipe"
        title="Print recipe"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}