export type Recipe = {
  id: string;
  title: string;
  category: string;
  image: string;
  ingredients: string[];
  steps: string[];
  minutes: number;
  servings: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
};

export type RootStackParams = {
  Home: undefined;
  RecipeDetail: { recipeId: string };
  MyFood: undefined;
  RecipesForm: { recipeId?: string } | undefined;
  Favorites: undefined;
};

export type SavedData = { recipes: Recipe[]; favoriteIds: string[] };

export function isRecipe(value: unknown): value is Recipe {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return ['id', 'title', 'category', 'image'].every(key => typeof r[key] === 'string') &&
    Array.isArray(r.ingredients) && r.ingredients.every(x => typeof x === 'string') &&
    Array.isArray(r.steps) && r.steps.every(x => typeof x === 'string') &&
    ['minutes', 'servings', 'calories'].every(key => typeof r[key] === 'number' && Number.isFinite(r[key])) &&
    ['Easy', 'Medium', 'Advanced'].includes(String(r.difficulty));
}

export function parseSavedData(raw: string | null): SavedData {
  if (!raw) return { recipes: [], favoriteIds: [] };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Saved recipes could not be read.');
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.recipes) || !data.recipes.every(isRecipe) ||
      !Array.isArray(data.favoriteIds) || !data.favoriteIds.every(id => typeof id === 'string')) {
    throw new Error('Saved recipes have an unsupported format.');
  }
  return { recipes: data.recipes, favoriteIds: [...new Set(data.favoriteIds)] };
}
