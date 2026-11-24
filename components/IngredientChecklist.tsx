'use client';

import React, { useState } from 'react';
import { Check, CheckCircle2, ClipboardList, Lightbulb } from 'lucide-react';
import { IngredientItem } from '@/types/meal';

interface IngredientChecklistProps {
  ingredients: IngredientItem[];
}

export function IngredientChecklist({ ingredients }: IngredientChecklistProps) {
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

  const totalCount = ingredients.length;
  const checkedCount = checkedIndices.size;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const toggleItem = (index: number) => {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const checkAll = () => {
    setCheckedIndices(new Set(ingredients.map((_, idx) => idx)));
  };

  const resetAll = () => {
    setCheckedIndices(new Set());
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-orange-600" aria-hidden="true" />
            <h2 className="text-lg font-extrabold tracking-tight text-stone-900">
              Ingredient Checklist
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">Mise en place &bull; Prep Checklist</p>
        </div>

        <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-600">
          {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Live Progress Bar & Batch Actions */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700">
            {checkedCount} of {totalCount} ingredients prepped
          </span>

          <div className="flex items-center gap-2 text-stone-500 print:hidden">
            <button
              type="button"
              onClick={checkAll}
              className="font-semibold text-orange-700 transition-colors hover:text-orange-800"
            >
              Check All
            </button>
            <span aria-hidden="true">&bull;</span>
            <button
              type="button"
              onClick={resetAll}
              className="transition-colors hover:text-stone-900"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Ingredient preparation progress"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPct === 100 ? 'bg-emerald-600' : 'bg-orange-600'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <ul className="mt-5 space-y-2.5" aria-label="Recipe ingredients">
        {ingredients.map((item, idx) => {
          const isChecked = checkedIndices.has(idx);
          return (
            <li key={`${item.ingredient}-${idx}`}>
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-pressed={isChecked}
                className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  isChecked
                    ? 'border-orange-200/80 bg-orange-50/50'
                    : 'border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isChecked
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : 'border-stone-300 bg-white group-hover:border-orange-400'
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[2.75]" />}
                  </span>

                  <span
                    className={`text-sm transition-colors ${
                      isChecked ? 'text-stone-400 line-through' : 'text-stone-800'
                    }`}
                  >
                    <strong className={isChecked ? 'font-semibold text-stone-400' : 'font-bold text-stone-900'}>
                      {item.measure}
                    </strong>{' '}
                    <span className="text-stone-400">&mdash;</span> {item.ingredient}
                  </span>
                </div>

                {isChecked && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Cooking Tip */}
      <div className="mt-5 rounded-xl border border-amber-200/70 bg-amber-50/70 p-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-800">
          <Lightbulb className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
          <span>Cooking Tip</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone-700">
          Measure all {totalCount} ingredients before turning on the stove so each step runs on schedule.
        </p>
      </div>
    </div>
  );
}