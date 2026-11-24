import React from 'react';

export function SkeletonCard() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-stone-200/80 dark:bg-stone-800" />
      <div className="space-y-2.5 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-stone-200 dark:bg-stone-800" />
        <div className="h-3.5 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800/60" />
        <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800/60" />
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/70 px-4 py-3 dark:border-stone-800 dark:bg-stone-950/50">
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-orange-200/70 dark:bg-orange-950/60" />
      </div>
    </div>
  );
}