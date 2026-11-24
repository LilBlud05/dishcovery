'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bookmark, Globe, Utensils } from 'lucide-react';
import { MealSummary } from '@/types/meal';
import { useCookbook } from './CookbookProvider';

interface RecipeCardProps {
  meal: MealSummary;
}

export function RecipeCard({ meal }: RecipeCardProps) {
  const { isSaved, toggleSave, hydrated } = useCookbook();
  const saved = hydrated && isSaved(meal.idMeal);

  const handleToggleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(meal);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md">
      {/* 4:3 Image Container */}
      <Link
        href={`/recipe/${meal.idMeal}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100"
      >
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category & Area Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5 pr-10">
          {meal.strCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-xs backdrop-blur-xs">
              <Utensils className="h-3 w-3 text-orange-600" aria-hidden="true" />
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
              <Globe className="h-3 w-3 text-amber-300" aria-hidden="true" />
              {meal.strArea}
            </span>
          )}
        </div>

        {/* Bookmark Toggle */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          aria-label={saved ? `Remove ${meal.strMeal} from cookbook` : `Save ${meal.strMeal} to cookbook`}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-stone-500 shadow-xs backdrop-blur-xs transition-all hover:scale-105 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Bookmark
            className={`h-4 w-4 transition-colors ${
              saved ? 'fill-orange-600 text-orange-600' : 'text-stone-500'
            }`}
          />
        </button>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/recipe/${meal.idMeal}`} className="focus:outline-none">
          <h3 className="line-clamp-1 text-base font-bold text-stone-900 transition-colors group-hover:text-orange-700">
            {meal.strMeal}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-stone-600">
          {meal.previewSummary ||
            `Ingredients and step-by-step cooking instructions for ${meal.strMeal}.`}
        </p>
      </div>

      {/* Card Footer */}
      <Link
        href={`/recipe/${meal.idMeal}`}
        className="flex items-center justify-between border-t border-stone-100 bg-orange-50/50 px-4 py-2.5 text-xs transition-colors group-hover:bg-orange-50"
      >
        <span className="font-semibold uppercase tracking-wider text-stone-500">
          {meal.strArea ? `${meal.strArea} Dish` : meal.strCategory || 'Recipe'}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-orange-700">
          View Recipe Steps
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </article>
  );
}