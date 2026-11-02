import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../model';
import { seedRecipes } from '../seed';
import { useFoodie } from '../store';
import { useTheme } from '../theme';
import { ErrorMessage, RecipeImage } from '../components/ui';

export default function RecipeDetailScreen({ route }: NativeStackScreenProps<RootStackParams, 'RecipeDetail'>) {
  const t = useTheme();
  const { recipes, favoriteIds, save, busy, error } = useFoodie();
  const recipe = [...recipes, ...seedRecipes].find(r => r.id === route.params.recipeId);
  if (!recipe) return <Text style={{ padding: 24, color: t.text }}>This recipe is no longer available.</Text>;
  const selected = favoriteIds.includes(recipe.id);
  const toggle = () => void save({ recipes, favoriteIds: selected ? favoriteIds.filter(id => id !== recipe.id) : [...favoriteIds, recipe.id] });
  return <ScrollView testID="recipe-detail" contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: t.background }} contentContainerStyle={{ padding: 20, gap: 22, paddingBottom: 48 }}>
    <RecipeImage uri={recipe.image} height={260} />
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Text selectable style={{ flex: 1, fontSize: 28, fontWeight: '700', color: t.text }}>{recipe.title}</Text>
      <Pressable testID="toggle-favorite" accessibilityRole="button" accessibilityLabel={selected ? 'Remove from favorites' : 'Add to favorites'} accessibilityState={{ selected, disabled: busy }} disabled={busy} onPress={toggle}
        style={{ padding: 12, borderRadius: 12, backgroundColor: t.surface }}><Text style={{ fontSize: 34, color: t.heart }}>{selected ? '♥' : '♡'}</Text></Pressable>
    </View>
    <ErrorMessage message={error} />
    <Text style={{ color: t.secondary, fontSize: 17 }}>{recipe.category}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {[`${recipe.minutes} min`, `${recipe.servings} servings`, `~${recipe.calories} kcal / serving`, recipe.difficulty].map(label =>
        <Text key={label} selectable style={{ padding: 12, borderRadius: 10, backgroundColor: t.surface, color: t.text, fontSize: 16 }}>{label}</Text>)}
    </View>
    <Text style={{ color: t.text, fontSize: 23, fontWeight: '600' }}>Ingredients</Text>
    {recipe.ingredients.map((ingredient, i) => <Text key={i} selectable style={{ fontSize: 17, color: t.text, lineHeight: 26 }}>• {ingredient}</Text>)}
    <Text style={{ color: t.text, fontSize: 23, fontWeight: '600' }}>Step-by-step instructions</Text>
    {recipe.steps.map((step, i) => <Text key={i} selectable style={{ fontSize: 17, lineHeight: 27, color: t.text }}>{i + 1}. {step}</Text>)}
    <Text style={{ color: t.secondary, fontSize: 14 }}>Cooking times and nutrition values are approximate.</Text>
  </ScrollView>;
}
