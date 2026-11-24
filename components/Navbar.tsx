"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dices, Heart, Loader2 } from "lucide-react";
import { getRandomMeal } from "@/lib/api";
import { useCookbook } from "./CookbookProvider";

export function Navbar() {
   const router = useRouter();
   const { savedMeals, hydrated } = useCookbook();

   const [isRandomLoading, setIsRandomLoading] = useState(false);

   const handleSurpriseMe = async () => {
      if (isRandomLoading) return;
      setIsRandomLoading(true);
      try {
         const meal = await getRandomMeal();
         if (meal) {
            router.push(`/recipe/${meal.idMeal}`);
         }
      } catch (error) {
         console.error("Could not load random recipe:", error);
      } finally {
         setIsRandomLoading(false);
      }
   };

   return (
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md print:hidden">
         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* Left: Official Logo + Nav Links */}
            <div className="flex items-center gap-6">
               <Link
                  href="/"
                  className="group flex items-center gap-2.5 focus:outline-none"
                  aria-label="Dishcovery Home"
               >
                  <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-orange-100 bg-orange-50 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                     <Image
                        src="/logo.png"
                        alt="Dishcovery logo"
                        fill
                        priority
                        sizes="36px"
                        className="object-contain p-0.5"
                     />
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-stone-900">
                     Dishcovery<span className="text-orange-600">.</span>
                  </span>
               </Link>
            </div>

            {/* Right: Cookbook + Surprise Me */}
            <div className="flex items-center gap-2.5">
               <Link
                  href="/cookbook"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 shadow-2xs transition-all hover:border-stone-300 hover:bg-stone-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
               >
                  <Heart
                     className="h-4 w-4 fill-rose-500 text-rose-500"
                     aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Cookbook</span>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
                     {hydrated ? savedMeals.length : 0}
                  </span>
               </Link>

               <button
                  type="button"
                  onClick={handleSurpriseMe}
                  disabled={isRandomLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-sm font-semibold text-orange-800 shadow-2xs transition-all hover:scale-[1.02] hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70"
               >
                  {isRandomLoading ? (
                     <Loader2
                        className="h-4 w-4 animate-spin text-orange-600"
                        aria-hidden="true"
                     />
                  ) : (
                     <Dices
                        className="h-4 w-4 text-orange-600"
                        aria-hidden="true"
                     />
                  )}
                  <span className="hidden sm:inline">Surprise Me</span>
               </button>
            </div>
         </div>
      </header>
   );
}
