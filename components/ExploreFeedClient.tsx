'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, RefreshCw, RotateCcw, UtensilsCrossed } from 'lucide-react';
import { Category, MealSummary } from '@/types/meal';
import { getInitialMeals, getMealsByCategory, searchMeals } from '@/lib/api';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter, SortOption } from '@/components/CategoryFilter';
import { RecipeCard } from '@/components/RecipeCard';
import { SkeletonCard } from '@/components/SkeletonCard';

const TRENDING_QUERIES = ['Arrabiata', 'Teriyaki', 'Salmon', 'Beef', 'Chocolate'];
const PAGE_SIZE = 8;

interface ExploreFeedClientProps {
  initialMeals: MealSummary[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialError?: string | null;
}

export function ExploreFeedClient({
  initialMeals,
  categories,
  initialQuery = '',
  initialCategory = 'All',
  initialError = null,
}: ExploreFeedClientProps) {
  const router = useRouter();

  const [meals, setMeals] = useState<MealSummary[]>(initialMeals);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  useEffect(() => {
    setMeals(initialMeals);
    setSearchInput(initialQuery);
    setActiveQuery(initialQuery);
    setActiveCategory(initialCategory);
    setErrorMessage(initialError);
    setVisibleCount(PAGE_SIZE);
  }, [initialMeals, initialQuery, initialCategory, initialError]);

  const runSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      setIsLoading(true);
      setErrorMessage(null);
      setActiveCategory('All');
      setActiveQuery(trimmed);
      setVisibleCount(PAGE_SIZE);

      try {
        const results = trimmed ? await searchMeals(trimmed) : await getInitialMeals();
        setMeals(results);
        router.replace(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/', { scroll: false });
      } catch {
        setErrorMessage('Unable to fetch recipes right now. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const handleSelectCategory = async (category: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveCategory(category);
    setSearchInput('');
    setActiveQuery('');
    setVisibleCount(PAGE_SIZE);

    try {
      const results =
        category === 'All' ? await getInitialMeals() : await getMealsByCategory(category);
      setMeals(results);
      router.replace(category === 'All' ? '/' : `/?category=${encodeURIComponent(category)}`, {
        scroll: false,
      });
    } catch {
      setErrorMessage(`Could not load recipes for ${category}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchInput('');
    handleSelectCategory('All');
  };

  const sortedMeals = useMemo(() => {
    if (sortBy === 'featured') return meals;
    const copy = [...meals];
    copy.sort((a, b) =>
      sortBy === 'az' ? a.strMeal.localeCompare(b.strMeal) : b.strMeal.localeCompare(a.strMeal)
    );
    return copy;
  }, [meals, sortBy]);

  const displayedMeals = sortedMeals.slice(0, visibleCount);
  const hasMore = visibleCount < sortedMeals.length;

  const feedTitle = activeQuery
    ? `Results for "${activeQuery}"`
    : activeCategory !== 'All'
      ? `${activeCategory} Dishes`
      : 'Fresh from the Kitchen';

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl pb-10 pt-10 text-center sm:pt-14">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600" aria-hidden="true" />
          TheMealDB Recipes &bull; Zero Ads
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.1] dark:text-stone-100">
          Cook tested recipes <span className="text-orange-700 dark:text-orange-500">without ads</span> or blog essays
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
          Dishcovery pulls recipes from TheMealDB into ingredient checklists and step guides that keep your screen awake while cooking. Home cooks can generate grocery lists and prepare meals without closing pop-ups or scrolling past personal stories.
        </p>

        <div className="mt-8">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={runSearch}
            onDebouncedChange={runSearch}
            onClear={() => {
              if (activeQuery) runSearch('');
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Trending Queries */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Trending:</span>
          {TRENDING_QUERIES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setSearchInput(term);
                runSearch(term);
              }}
              className="rounded-full border border-stone-200 bg-white px-3 py-1 font-medium text-stone-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-500/50 dark:hover:bg-stone-800 dark:hover:text-orange-300"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Category Filter Bar */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Recipe Grid Feed */}
      <section className="mt-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-orange-700 dark:text-orange-400">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Browse Recipes</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
              {feedTitle}
            </h2>
            <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-400">
              {isLoading
                ? 'Loading recipes from TheMealDB...'
                : `${sortedMeals.length} ${
                    sortedMeals.length === 1 ? 'dish' : 'dishes'
                  } with step-by-step instructions and prep checklists.`}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Live TheMealDB Feed</span>
          </div>
        </div>

        {/* Error State */}
        {errorMessage && !isLoading && (
          <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 px-6 py-12 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <p className="text-base font-semibold text-rose-900 dark:text-rose-200">{errorMessage}</p>
            <button
              type="button"
              onClick={() => (activeQuery ? runSearch(activeQuery) : handleSelectCategory(activeCategory))}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && sortedMeals.length === 0 && (
          <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center dark:border-stone-800 dark:bg-stone-900">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <UtensilsCrossed className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">No dishes matched your search</h3>
            <p className="mt-1.5 max-w-md text-sm text-stone-600 dark:text-stone-400">
              Try another keyword such as &ldquo;Chicken&rdquo;, &ldquo;Pasta&rdquo;, or reset your
              filters to browse all dishes.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset Filters
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !errorMessage && displayedMeals.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedMeals.map((meal) => (
                <RecipeCard key={meal.idMeal} meal={meal} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-2xs transition-all hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-700 dark:hover:bg-stone-800"
                >
                  <span>Load More Recipes</span>
                  <RefreshCw className="h-4 w-4 text-stone-500 dark:text-stone-400" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}