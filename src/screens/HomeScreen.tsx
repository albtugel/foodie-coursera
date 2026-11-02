import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../model';
import { categories, seedRecipes } from '../seed';
import { useTheme } from '../theme';
import { ActionButton, RecipeCard } from '../components/ui';

export default function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParams, 'Home'>) {
  const t = useTheme();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const recipes = seedRecipes.filter(r => (category === 'All' || r.category === category) && r.title.toLowerCase().includes(query.toLowerCase().trim()));
  return <FlatList testID="home-feed" data={recipes} keyExtractor={r => r.id} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled"
    style={{ backgroundColor: t.background }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    ListHeaderComponent={<View style={{ gap: 18, marginBottom: 20 }}>
      <Text style={{ color: t.text, fontSize: 26, fontWeight: '600' }}>Make something delicious.</Text>
      <Text style={{ color: t.secondary, fontSize: 16 }}>Explore recipes, save favorites, and create your own.</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><ActionButton id="my-food" label="My Food" onPress={() => navigation.navigate('MyFood')} /></View>
        <View style={{ flex: 1 }}><ActionButton id="favorites" label="My Favorites" onPress={() => navigation.navigate('Favorites')} /></View>
      </View>
      <TextInput testID="recipe-search" accessibilityLabel="Search recipes" placeholder="Search recipes" placeholderTextColor={t.secondary}
        value={query} onChangeText={setQuery} style={{ backgroundColor: t.surface, color: t.text, padding: 15, borderRadius: 12, fontSize: 17 }} />
      <ScrollView horizontal testID="categories" showsHorizontalScrollIndicator contentContainerStyle={{ gap: 12 }}>
        {[{ name: 'All', image: '' }, ...categories].map(c => <Pressable key={c.name} testID={`category-${c.name}`} accessibilityRole="button" accessibilityLabel={`${c.name} recipes`} accessibilityState={{ selected: category === c.name }}
          onPress={() => setCategory(c.name)} style={{ padding: 12, borderRadius: 12, alignItems: 'center', gap: 8, minWidth: 90, borderWidth: 2, borderColor: category === c.name ? t.accent : t.border, backgroundColor: t.surface }}>
          {c.image ? <Image source={{ uri: c.image }} style={{ height: 54, width: 68, borderRadius: 8 }} /> : <Text style={{ fontSize: 34, color: t.text }}>≡</Text>}
          <Text style={{ color: t.text, fontSize: 15, fontWeight: '600' }}>{c.name}</Text>
        </Pressable>)}
      </ScrollView>
      <Text style={{ color: t.text, fontSize: 21, fontWeight: '600' }}>{category} recipes · {recipes.length}</Text>
    </View>}
    renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })} />}
    ListEmptyComponent={<View style={{ gap: 16 }}><Text style={{ color: t.secondary }}>No matching recipes. Try another search or category.</Text><ActionButton id="clear-filters" label="Clear filters" onPress={() => { setCategory('All'); setQuery(''); }} /></View>} />;
}
