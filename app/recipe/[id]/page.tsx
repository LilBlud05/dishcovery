import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Globe,
  ListOrdered,
  Utensils,
} from 'lucide-react';
import { getMealById } from '@/lib/api';
import { IngredientChecklist } from '@/components/IngredientChecklist';
import { StepGuide } from '@/components/StepGuide';
import { VideoEmbed } from '@/components/VideoEmbed';
import { RecipeDetailActions } from '@/components/RecipeDetailActions';

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: meal.strMeal,
    description: `Cook ${meal.strMeal} (${meal.strArea || 'International'} ${
      meal.strCategory || 'Recipe'
    }) with ${meal.ingredients.length} ingredients and ${meal.steps.length} clear steps.`,
    openGraph: {
      title: `${meal.strMeal} | Dishcovery`,
      description: `Step-by-step recipe and mise en place checklist for ${meal.strMeal}.`,
      images: [{ url: meal.strMealThumb, alt: meal.strMeal }],
    },
  };
}

async function RecipeContent({ params }: RecipePageProps) {
  await connection();
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    notFound();
  }

  const parsedTags = meal.strTags
    ? meal.strTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="mb-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Recipe Discovery</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-white to-orange-50/70 p-6 shadow-2xs transition-colors dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-orange-950/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {meal.strCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-800 shadow-2xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
              <Utensils className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900 dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300">
              <Globe className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
              {meal.strArea}
            </span>
          )}
          {parsedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12] dark:text-stone-100">
          {meal.strMeal}
        </h1>

        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
          {meal.strArea ? `${meal.strArea} ` : ''}
          {meal.strCategory ? meal.strCategory.toLowerCase() : 'recipe'} with{' '}
          {meal.ingredients.length} measured ingredients and {meal.steps.length} preparation
          steps.
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-stone-200/70 pt-5 dark:border-stone-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600 sm:text-sm dark:text-stone-400">
            <div className="inline-flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-stone-900 dark:text-stone-200">{meal.ingredients.length}</strong>{' '}
                Ingredients
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-stone-900 dark:text-stone-200">{meal.steps.length}</strong>{' '}
                Cooking Steps
              </span>
            </div>
            {meal.strArea && (
              <div className="inline-flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-600" aria-hidden="true" />
                <span>
                  Origin: <strong className="font-semibold text-stone-900 dark:text-stone-200">{meal.strArea}</strong>
                </span>
              </div>
            )}
          </div>

          <RecipeDetailActions meal={meal} />
        </div>
      </section>

      {/* Two-Column Content Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Sticky Column: Photo & Mise en Place Checklist */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-stone-800">
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-xl bg-stone-900/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>{meal.strArea ? `${meal.strArea} Dish` : 'TheMealDB Recipe'}</span>
              </div>
            </div>
          </div>

          <IngredientChecklist ingredients={meal.ingredients} />
        </aside>

        {/* Right Column: Step Guide & YouTube Embed */}
        <div className="space-y-8 lg:col-span-7">
          <StepGuide steps={meal.steps} fallbackInstructions={meal.strInstructions} />

          <VideoEmbed youtubeUrl={meal.strYoutube} mealTitle={meal.strMeal} />

          {meal.strSource && (
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Recipe Attribution
                </p>
                <p className="mt-0.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                  View original culinary publication reference
                </p>
              </div>
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                <span>Original Source</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipeDetailPage(props: RecipePageProps) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-label="Loading recipe" />}>
      <RecipeContent {...props} />
    </Suspense>
  );
}