'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onDebouncedChange?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onDebouncedChange,
  onClear,
  debounceMs = 450,
  isLoading = false,
}: SearchBarProps) {
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    if (!onDebouncedChange || !hasInteractedRef.current) return;

    const timer = setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hasInteractedRef.current = false;
    onSubmit(value);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm transition-shadow focus-within:border-orange-400 focus-within:shadow-md focus-within:ring-4 focus-within:ring-orange-500/10"
      role="search"
    >
      <div className="relative flex flex-1 items-center">
        <Search
          className="pointer-events-none ml-3.5 h-5 w-5 shrink-0 text-orange-600/85"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            hasInteractedRef.current = true;
            onChange(e.target.value);
          }}
          placeholder="Search by dish name, ingredient, or cuisine (e.g. Pasta, Teriyaki, Beef)"
          aria-label="Search recipes by dish name"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none sm:text-base"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              hasInteractedRef.current = false;
              onChange('');
              onClear?.();
            }}
            aria-label="Clear search query"
            className="mr-1 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-60"
      >
        <span>Search</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}