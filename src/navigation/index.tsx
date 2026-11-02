import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParams } from '../model';
import { FoodieProvider } from '../store';
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MyRecipeScreen from '../screens/MyRecipeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import RecipesFormScreen from '../screens/RecipesFormScreen';

const Stack = createNativeStackNavigator<RootStackParams>();
export default function AppNavigation() {
  const dark = useColorScheme() === 'dark';
  return <SafeAreaProvider><FoodieProvider><NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Foodie' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
      <Stack.Screen name="MyFood" component={MyRecipeScreen} options={{ title: 'My Recipes' }} />
      <Stack.Screen name="Favorites" component={FavoriteScreen} options={{ title: 'My Favorites' }} />
      <Stack.Screen name="RecipesForm" component={RecipesFormScreen} options={({ route }) => ({ title: route.params?.recipeId ? 'Edit Recipe' : 'Add New Recipe' })} />
    </Stack.Navigator>
  </NavigationContainer></FoodieProvider></SafeAreaProvider>;
}
