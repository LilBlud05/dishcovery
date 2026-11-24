'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Dices, Loader2, Search, Utensils } from 'lucide-react';
import { getRandomMeal } from '@/lib/api';
import { MealSummary } from '@/types/meal';
import { RecipeCard } from '@/components/RecipeCard';

const POPULAR_SEARCHES = ['Pasta', 'Curry', 'Salmon', 'Chicken'];

export function NotFoundClient({ staffPicks }: { staffPicks: MealSummary[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isRolling, setIsRolling] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  };

  const handleSurpriseMe = async () => {
    if (isRolling) return;
    setIsRolling(true);
    try {
      const meal = await getRandomMeal();
      if (meal) {
        router.push(`/recipe/${meal.idMeal}`);
      }
    } catch (error) {
      console.error('Failed to roll random recipe:', error);
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Recipe Discovery</span>
        </Link>

        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          <span>Kitchen Status 404</span>
        </div>
      </div>

      {/* Centered 404 Hero */}
      <section className="mx-auto flex max-w-2xl flex-col items-center pb-14 pt-10 text-center sm:pt-14">
        <div className="relative mb-5 h-32 w-44">
          <Image
            src="/404.png"
            alt="Empty dish cloche illustration"
            fill
            priority
            sizes="176px"
            className="object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-orange-800">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600" aria-hidden="true" />
          <span>Error 404 &bull; Lost in the Pantry</span>
        </div>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
          We couldn&rsquo;t find that dish<span className="text-orange-600">.</span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base">
          The recipe you are looking for could not be found. You can search for another dish or browse the suggestions below.
        </p>

        {/* Recovery Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10"
          role="search"
        >
          <Search className="ml-3 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try searching for another dish or ingredient..."
            aria-label="Search for another recipe"
            className="w-full bg-transparent px-2 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-orange-800 sm:text-sm"
          >
            <span>Find Recipe</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </form>

        {/* Popular Search Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-medium text-stone-400">Popular searches:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-stone-200 bg-white px-3 py-1 font-medium text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
            >
              {term}
            </Link>
          ))}
        </div>

        {/* Recovery CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-800"
          >
            <Utensils className="h-4 w-4" aria-hidden="true" />
            <span>Return to Recipe Discovery</span>
          </Link>

          <button
            type="button"
            onClick={handleSurpriseMe}
            disabled={isRolling}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-100/90 px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-200/80 disabled:opacity-60"
          >
            {isRolling ? (
              <Loader2 className="h-4 w-4 animate-spin text-orange-600" aria-hidden="true" />
            ) : (
              <Dices className="h-4 w-4 text-orange-600" aria-hidden="true" />
            )}
            <span>Roll the Dice (Surprise Me)</span>
          </button>
        </div>
      </section>

      {/* Staff Picks Fallback Grid */}
      {staffPicks.length > 0 && (
        <section className="border-t border-stone-200/80 pt-10">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-orange-700">
                Suggested Dishes
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
                Popular Recipes
              </h2>
            </div>

            <p className="text-xs text-stone-500 sm:text-sm">
              Tested recipes from TheMealDB.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {staffPicks.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}