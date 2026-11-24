import React from 'react';
import { getInitialMeals } from '@/lib/api';
import { MealSummary } from '@/types/meal';
import { NotFoundClient } from '@/components/NotFoundClient';

export default async function NotFound() {
  let staffPicks: MealSummary[] = [];

  try {
    const meals = await getInitialMeals();
    staffPicks = meals.slice(0, 3);
  } catch {
    staffPicks = [];
  }

  return <NotFoundClient staffPicks={staffPicks} />;
}