# Dishcovery

Dishcovery is a responsive recipe discovery and cooking companion built with Next.js 16, React 19, and Tailwind CSS. It uses TheMealDB API to help users search recipes, browse cuisine categories, save meals to a personal cookbook, follow step-by-step instructions, and export grocery lists.

## Features

- Search meals by name or ingredient
- Browse recipes by TheMealDB category
- Sort and load recipe results incrementally
- View ingredients, preparation steps, origin, tags, and recipe sources
- Watch linked YouTube cooking videos
- Keep the screen awake while following a recipe
- Save recipes to a browser-local cookbook
- Filter saved recipes and generate, copy, or download grocery lists
- Responsive, warm culinary interface with loading and error states

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React icons
- TheMealDB API

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment Variables

The app uses the public TheMealDB API by default. To use another compatible API endpoint, add the following optional variable:

```bash
NEXT_PUBLIC_MEALDB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

## Project Structure

```text
app/
  page.tsx                 Home recipe discovery feed
  cookbook/page.tsx        Saved cookbook and grocery lists
  recipe/[id]/page.tsx     Full recipe detail view
components/                Shared UI and interactive components
lib/api.ts                 TheMealDB API and data-normalization helpers
types/meal.ts              Meal, category, and API response types
public/                    Static brand and image assets
```

## Data and Storage

Recipe and category data is fetched from TheMealDB. Saved recipes are stored in `localStorage` under `dishcovery_cookbook_v1`, so the personal cookbook remains available in the browser and can sync across tabs on the same origin.

## License

This project is currently provided without an explicit license. Review the repository owner’s terms before redistributing or publishing derived work.
