'use client';

import React, { useEffect, useState } from 'react';
import { Check, ChefHat, RotateCcw } from 'lucide-react';

interface StepGuideProps {
  steps: string[];
  fallbackInstructions?: string;
}

export function StepGuide({ steps, fallbackInstructions }: StepGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [chefMode, setChefMode] = useState(false);

  // Screen Wake Lock when Chef Mode is active
  useEffect(() => {
    if (!chefMode || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let active = true;

    (async () => {
      try {
        if (navigator.wakeLock && active) {
          sentinel = await navigator.wakeLock.request('screen');
        }
      } catch {
        // Ignore on browsers/contexts where Wake Lock is restricted
      }
    })();

    return () => {
      active = false;
      sentinel?.release().catch(() => {});
    };
  }, [chefMode]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section aria-labelledby="instructions-heading">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2
            id="instructions-heading"
            className="text-2xl font-extrabold tracking-tight text-stone-900"
          >
            Step-by-Step Instructions
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
            {chefMode
              ? 'Chef Mode active: enlarged text and screen wake lock enabled.'
              : 'Tap any step to mark it completed.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {completedSteps.size > 0 && (
            <button
              type="button"
              onClick={() => setCompletedSteps(new Set())}
              className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={() => setChefMode((prev) => !prev)}
            aria-pressed={chefMode}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              chefMode
                ? 'border-orange-600 bg-orange-600 text-white'
                : 'border-amber-200 bg-amber-50 text-stone-800 hover:bg-amber-100'
            }`}
          >
            <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Chef Mode</span>
          </button>

          <span className="inline-flex items-center rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900">
            {completedSteps.size}/{steps.length} Done
          </span>
        </div>
      </div>

      {steps.length > 0 ? (
        <ol className="space-y-4">
          {steps.map((stepText, idx) => {
            const isDone = completedSteps.has(idx);
            const stepLabel = String(idx + 1).padStart(2, '0');

            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => toggleStep(idx)}
                  aria-pressed={isDone}
                  className={`group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-stone-200 bg-white shadow-2xs hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-600 text-white group-hover:bg-orange-700'
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4 stroke-[2.75]" /> : stepLabel}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Step {idx + 1}
                      </span>
                      {isDone && (
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1.5 leading-relaxed transition-colors ${
                        chefMode ? 'text-base sm:text-lg sm:leading-8' : 'text-sm sm:text-base'
                      } ${isDone ? 'text-stone-500' : 'text-stone-800'}`}
                    >
                      {stepText}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-relaxed text-stone-700">
          {fallbackInstructions || 'No preparation instructions available for this dish.'}
        </div>
      )}
    </section>
  );
}