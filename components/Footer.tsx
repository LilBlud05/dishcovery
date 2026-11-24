import React from "react";

export function Footer() {
   return (
      <footer className="border-t border-stone-200 bg-white/80 print:hidden">
         <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p>
               &copy; 2026 Dishcovery. Recipes from TheMealDB with step guides and prep checklists.
            </p>

            <div className="flex flex-wrap items-center gap-6">
               <a
                  href="https://www.themealdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-stone-900"
               >
                  Powered by TheMealDB
               </a>
            </div>
         </div>
      </footer>
   );
}
