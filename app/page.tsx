import React, { Suspense } from "react";
import {
   getCategories,
   getInitialMeals,
   getMealsByCategory,
   searchMeals,
} from "@/lib/api";
import { Category, MealSummary } from "@/types/meal";
import { ExploreFeedClient } from "@/components/ExploreFeedClient";

interface HomePageProps {
   searchParams: Promise<{
      q?: string;
      category?: string;
   }>;
}

async function HomeFeed({ searchParams }: HomePageProps) {
   const resolvedParams = await searchParams;
   const query = resolvedParams.q?.trim() || "";
   const category = resolvedParams.category?.trim() || "All";

   let categories: Category[] = [];
   let initialMeals: MealSummary[] = [];
   let initialError: string | null = null;

   try {
      const [fetchedCategories, fetchedMeals] = await Promise.all([
         getCategories(),
         query
            ? searchMeals(query)
            : category !== "All"
              ? getMealsByCategory(category)
              : getInitialMeals(),
      ]);

      categories = fetchedCategories;
      initialMeals = fetchedMeals;
   } catch {
      initialError =
         "Unable to connect to TheMealDB right now. Please try again shortly.";
   }

   return (
      <ExploreFeedClient
         initialMeals={initialMeals}
         categories={categories}
         initialQuery={query}
         initialCategory={query ? "All" : category}
         initialError={initialError}
      />
   );
}

export default function HomePage(props: HomePageProps) {
   return (
      <Suspense
         fallback={
            <div className="min-h-[60vh]" aria-label="Loading recipes" />
         }
      >
         <HomeFeed {...props} />
      </Suspense>
   );
}
