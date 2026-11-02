import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../model';
import { seedRecipes } from '../seed';
import { useFoodie } from '../store';
import { useTheme } from '../theme';
import { ActionButton, RecipeCard } from '../components/ui';

export default function FavoriteScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Favorites'>) {
  const t = useTheme();
  const { recipes, favoriteIds } = useFoodie();
  const favorites = [...seedRecipes, ...recipes].filter(r => favoriteIds.includes(r.id));
  return <FlatList testID="favorites-list" data={favorites} keyExtractor={r => r.id} contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: t.background }} contentContainerStyle={{ padding: 20 }}
    renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })} />}
    ListEmptyComponent={<View style={{ gap: 20 }}><Text style={{ color: t.secondary, fontSize: 18 }}>No favorite recipes yet. Tap a heart on any recipe to save it here.</Text><ActionButton id="browse-recipes" label="Browse recipes" onPress={() => navigation.popToTop()} /></View>} />;
}
