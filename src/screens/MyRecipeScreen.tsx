import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../model';
import { useFoodie } from '../store';
import { useTheme } from '../theme';
import { ActionButton, ErrorMessage, RecipeCard } from '../components/ui';

export default function MyRecipeScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'MyFood'>) {
  const t = useTheme();
  const { recipes, favoriteIds, save, busy, error } = useFoodie();
  const [deleting, setDeleting] = useState<string | null>(null);
  const remove = async (id: string) => {
    if (await save({ recipes: recipes.filter(r => r.id !== id), favoriteIds: favoriteIds.filter(value => value !== id) })) setDeleting(null);
  };
  return <FlatList testID="my-recipes" data={recipes} keyExtractor={r => r.id} contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: t.background }} contentContainerStyle={{ padding: 20, gap: 12 }}
    ListHeaderComponent={<View style={{ gap: 16, marginBottom: 18 }}><ActionButton id="add-recipe" label="Add New Recipe" onPress={() => navigation.navigate('RecipesForm')} /><ErrorMessage message={error} /></View>}
    renderItem={({ item }) => <View style={{ gap: 10, marginBottom: 22 }}>
      <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })} />
      {deleting === item.id ? <><Text style={{ color: t.text }}>Delete “{item.title}”?</Text><ActionButton id={`confirm-delete-${item.id}`} label="Confirm delete" danger disabled={busy} onPress={() => void remove(item.id)} /><ActionButton id="cancel-delete" label="Cancel" onPress={() => setDeleting(null)} /></> :
        <View style={{ flexDirection: 'row', gap: 12 }}><View style={{ flex: 1 }}><ActionButton id={`edit-${item.id}`} label="Edit" disabled={busy} onPress={() => navigation.navigate('RecipesForm', { recipeId: item.id })} /></View><View style={{ flex: 1 }}><ActionButton id={`delete-${item.id}`} label="Delete" danger disabled={busy} onPress={() => setDeleting(item.id)} /></View></View>}
    </View>}
    ListEmptyComponent={<Text style={{ color: t.secondary, fontSize: 18 }}>No recipes added yet. Create your first recipe using the button above.</Text>} />;
}
