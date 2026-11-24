'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookMarked,
  Check,
  Copy,
  Download,
  Globe,
  Loader2,
  ShoppingCart,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useCookbook } from '@/components/CookbookProvider';
import { getMealById } from '@/lib/api';
import { IngredientItem, MealSummary } from '@/types/meal';
import { SkeletonCard } from '@/components/SkeletonCard';

interface GroceryGroup {
  mealTitle: string;
  ingredients: IngredientItem[];
}

export default function CookbookPage() {
  const { savedMeals, removeMeal, clearAll, hydrated } = useCookbook();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [confirmClear, setConfirmClear] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [groceryGroups, setGroceryGroups] = useState<GroceryGroup[] | null>(null);
  const [copiedList, setCopiedList] = useState(false);

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const meal of savedMeals) {
      const category = meal.strCategory || 'Uncategorized';
      counts.set(category, (counts.get(category) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [savedMeals]);

  const uniqueAreaCount = useMemo(() => {
    return new Set(savedMeals.map((m) => m.strArea).filter(Boolean)).size;
  }, [savedMeals]);

  const activeFilter =
    selectedCategory === 'All' || categoryBreakdown.some(([cat]) => cat === selectedCategory)
      ? selectedCategory
      : 'All';

  const filteredMeals = useMemo(() => {
    if (activeFilter === 'All') return savedMeals;
    return savedMeals.filter(
      (meal) => (meal.strCategory || 'Uncategorized') === activeFilter
    );
  }, [savedMeals, activeFilter]);

  const handleExportGroceryList = async () => {
    if (filteredMeals.length === 0 || isExporting) return;
    setIsExporting(true);
    setCopiedList(false);

    try {
      const details = await Promise.all(filteredMeals.map((meal) => getMealById(meal.idMeal)));
      const groups: GroceryGroup[] = details
        .filter((d): d is NonNullable<typeof d> => d !== null)
        .map((detail) => ({
          mealTitle: detail.strMeal,
          ingredients: detail.ingredients,
        }));
      setGroceryGroups(groups);
    } catch (error) {
      console.error('Failed to export grocery list:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formattedGroceryText = useMemo(() => {
    if (!groceryGroups) return '';
    return groceryGroups
      .map(
        (group) =>
          `${group.mealTitle}\n` +
          group.ingredients.map((item) => `  - [ ] ${item.measure} ${item.ingredient}`).join('\n')
      )
      .join('\n\n');
  }, [groceryGroups]);

  const handleCopyGroceryList = async () => {
    if (!formattedGroceryText) return;
    try {
      await navigator.clipboard.writeText(formattedGroceryText);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2500);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
    }
  };

  const handleDownloadGroceryList = () => {
    if (!formattedGroceryText) return;
    const blob = new Blob([formattedGroceryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dishcovery-grocery-list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Recipe Discovery</span>
        </Link>
      </div>

      {/* Header & Summary Cards */}
      <section className="flex flex-col justify-between gap-6 pb-8 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            My Cookbook<span className="text-orange-600">.</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
            Saved recipes stored in your browser, with one-click grocery list exports for meal planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <BookMarked className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Saved Meals
              </p>
              <p className="text-base font-extrabold text-stone-900">
                {hydrated ? savedMeals.length : 0}{' '}
                {savedMeals.length === 1 ? 'Recipe' : 'Recipes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Globe className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Cuisines
              </p>
              <p className="text-base font-extrabold text-stone-900">
                {hydrated ? uniqueAreaCount : 0}{' '}
                {uniqueAreaCount === 1 ? 'Region' : 'Regions'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sub-Filters & Actions */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter saved recipes by category"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'All'}
            onClick={() => setSelectedCategory('All')}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeFilter === 'All'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <span>All Recipes</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeFilter === 'All' ? 'bg-white/20 text-white' : 'bg-white text-stone-700'
              }`}
            >
              {hydrated ? savedMeals.length : 0}
            </span>
          </button>

          {categoryBreakdown.map(([category, count]) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-700 text-white shadow-xs'
                    : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/70'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportGroceryList}
            disabled={!hydrated || filteredMeals.length === 0 || isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Export Grocery List</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={!hydrated || savedMeals.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear All</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs">
              <span className="font-semibold text-rose-800">Remove all?</span>
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setConfirmClear(false);
                }}
                className="rounded-lg bg-rose-600 px-2.5 py-1 font-semibold text-white hover:bg-rose-700"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-lg px-2 py-1 font-medium text-stone-600 hover:bg-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hydration Loading State */}
      {!hydrated && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {hydrated && savedMeals.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white px-6 py-20 text-center shadow-2xs">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <BookMarked className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900">Your cookbook is empty</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600">
            Bookmark any recipe from the Explore feed or dish detail page to build your personal
            collection for weeknight dinners.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-700"
          >
            <Utensils className="h-4 w-4" aria-hidden="true" />
            <span>Explore Recipes</span>
          </Link>
        </div>
      )}

      {/* Saved Recipes Grid */}
      {hydrated && filteredMeals.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMeals.map((meal: MealSummary) => (
            <article
              key={meal.idMeal}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <Link href={`/recipe/${meal.idMeal}`} className="block h-full w-full">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {meal.strCategory && (
                  <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-xs backdrop-blur-xs">
                    <Utensils className="h-3 w-3 text-orange-600" aria-hidden="true" />
                    {meal.strCategory}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeMeal(meal.idMeal)}
                  aria-label={`Remove ${meal.strMeal} from cookbook`}
                  title="Remove from cookbook"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Bookmark className="h-4 w-4 fill-orange-600 text-orange-600" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                  {meal.strCategory || 'Recipe'}
                  {meal.strArea ? <span className="text-stone-400"> &bull; {meal.strArea}</span> : null}
                </p>

                <Link href={`/recipe/${meal.idMeal}`} className="mt-1 focus:outline-none">
                  <h2 className="line-clamp-1 text-base font-extrabold text-stone-900 transition-colors group-hover:text-orange-700">
                    {meal.strMeal}
                  </h2>
                </Link>

                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Ready to cook
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <span className="text-stone-500">
                    {meal.strArea ? `${meal.strArea} cuisine` : 'Saved recipe'}
                  </span>
                  <Link
                    href={`/recipe/${meal.idMeal}`}
                    className="inline-flex items-center gap-1 font-semibold text-orange-700 transition-colors hover:text-orange-800"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Grocery List Modal */}
      {groceryGroups && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="grocery-modal-title"
        >
          <div className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <div>
                <h3 id="grocery-modal-title" className="text-lg font-extrabold text-stone-900">
                  Cookbook Grocery List
                </h3>
                <p className="text-xs text-stone-500">
                  Ingredients compiled from {groceryGroups.length}{' '}
                  {groceryGroups.length === 1 ? 'recipe' : 'recipes'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGroceryGroups(null)}
                aria-label="Close grocery list"
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {groceryGroups.map((group) => (
                <div key={group.mealTitle}>
                  <h4 className="text-sm font-bold text-orange-800">{group.mealTitle}</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                    {group.ingredients.map((item, idx) => (
                      <li key={idx} className="flex items-baseline gap-2">
                        <span className="text-orange-500">&bull;</span>
                        <span>
                          <strong className="font-semibold text-stone-900">{item.measure}</strong>{' '}
                          {item.ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-stone-200 bg-stone-50 px-6 py-4">
              <button
                type="button"
                onClick={handleCopyGroceryList}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100"
              >
                {copiedList ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy List</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadGroceryList}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-800"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}