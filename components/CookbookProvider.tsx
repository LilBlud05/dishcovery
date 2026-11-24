'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MealSummary } from '@/types/meal';

interface CookbookContextValue {
  savedMeals: MealSummary[];
  isSaved: (idMeal: string) => boolean;
  toggleSave: (meal: MealSummary) => void;
  removeMeal: (idMeal: string) => void;
  clearAll: () => void;
  hydrated: boolean;
}

const STORAGE_KEY = 'dishcovery_cookbook_v1';

const CookbookContext = createContext<CookbookContextValue | undefined>(undefined);

export function CookbookProvider({ children }: { children: React.ReactNode }) {
  const [savedMeals, setSavedMeals] = useState<MealSummary[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MealSummary[];
        if (Array.isArray(parsed)) {
          setSavedMeals(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to read cookbook from localStorage:', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMeals));
    } catch (error) {
      console.error('Failed to write cookbook to localStorage:', error);
    }
  }, [savedMeals, hydrated]);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const parsed = event.newValue ? (JSON.parse(event.newValue) as MealSummary[]) : [];
        if (Array.isArray(parsed)) {
          setSavedMeals(parsed);
        }
      } catch (error) {
        console.error('Failed to sync cookbook across tabs:', error);
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const isSaved = useCallback(
    (idMeal: string) => savedMeals.some((item) => item.idMeal === idMeal),
    [savedMeals]
  );

  const toggleSave = useCallback((meal: MealSummary) => {
    setSavedMeals((prev) => {
      const exists = prev.some((item) => item.idMeal === meal.idMeal);
      if (exists) {
        return prev.filter((item) => item.idMeal !== meal.idMeal);
      }
      const normalized: MealSummary = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory,
        strArea: meal.strArea,
        strTags: meal.strTags,
        previewSummary: meal.previewSummary,
      };
      return [normalized, ...prev];
    });
  }, []);

  const removeMeal = useCallback((idMeal: string) => {
    setSavedMeals((prev) => prev.filter((item) => item.idMeal !== idMeal));
  }, []);

  const clearAll = useCallback(() => {
    setSavedMeals([]);
  }, []);

  return (
    <CookbookContext.Provider
      value={{ savedMeals, isSaved, toggleSave, removeMeal, clearAll, hydrated }}
    >
      {children}
    </CookbookContext.Provider>
  );
}

export function useCookbook() {
  const context = useContext(CookbookContext);
  if (!context) {
    throw new Error('useCookbook must be used within a CookbookProvider');
  }
  return context;
}