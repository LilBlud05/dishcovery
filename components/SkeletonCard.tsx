import React from 'react';

export function SkeletonCard() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-stone-200/80" />
      <div className="space-y-2.5 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-stone-200" />
        <div className="h-3.5 w-full animate-pulse rounded-md bg-stone-100" />
        <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-stone-100" />
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/70 px-4 py-3">
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-orange-200/70" />
      </div>
    </div>
  );
}