# Foodie

React Native recipe application for the course “React Native: Developing Android and iOS Apps”.

## Run

```sh
npm ci --legacy-peer-deps
npm run web
```

The course template uses Expo SDK 51. In Expo Snack, choose **v51.0.0**, then use **Import Git Repository** to import the repository root and select the Web preview. SDK 51 is available in the Snack SDK selector. Native preview needs a matching Expo Go version.

```sh
npx tsc --noEmit
npx expo export --platform web
```

## Features and review checklist

- Horizontally scrollable catalog of 14 recipe categories, with 26 recipes in total.
- Search by title and filter by category; every category contains a recipe.
- Recipe details: image, ingredients, numbered instructions, cooking time, servings, approximate calories, and difficulty.
- Heart toggles to add or remove a recipe from My Favorites.
- My Food opens My Recipes; Add New Recipe opens an editable form.
- Create a recipe with a title, uploaded image or image URL, ingredients, and step-by-step instructions. Time, servings, and approximate calories are editable too.
- Save Recipe persists the recipe and returns to My Recipes.
- Open a personal recipe to view its full details. Edit and Delete are available on each personal recipe; deletion requires confirmation.
- Native stack headers provide functional back navigation.
- Personal recipes and favorites persist in AsyncStorage; loading and saving errors are explicit, and failed saves preserve the form.
- TypeScript strict mode and accessible labels/test identifiers on form and action controls.

## Validation

TypeScript checking and the production web export pass. Browser checks exercised category filtering, recipe details, heart toggling, favorite-list display, empty-form validation, recipe creation, editing, persistence after reload, and deletion.

The browser permission gate prevented an automated local file-upload check. The image-URL path was exercised successfully. Native iOS/Android execution has not been verified in this environment.

## Structure

`src/screens/` contains the five screens, `src/navigation/` the typed stack, `src/store.tsx` Redux state and persistence, and `src/seed.ts` the bundled catalog. Shared controls and colors live in `src/components/ui.tsx` and `src/theme.ts`.

## Credits

Adapted from the course's [FoodRecipe template](https://github.com/sktcontentteam/FoodRecipe). The original Apache 2.0 license is retained in `LICENSE`. Existing image URLs and template recipes are preserved; additional sample recipes ensure all categories have content. Nutrition values and cooking times are approximate.
