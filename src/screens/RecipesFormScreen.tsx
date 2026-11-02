import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Recipe, RootStackParams } from '../model';
import { useFoodie } from '../store';
import { useTheme } from '../theme';
import { ActionButton, ErrorMessage, RecipeImage } from '../components/ui';

export default function RecipesFormScreen({ route, navigation }: NativeStackScreenProps<RootStackParams, 'RecipesForm'>) {
  const t = useTheme();
  const { recipes, favoriteIds, save, busy, error } = useFoodie();
  const existing = recipes.find(r => r.id === route.params?.recipeId);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [image, setImage] = useState(existing?.image ?? '');
  const [ingredients, setIngredients] = useState(existing?.ingredients.join('\n') ?? '');
  const [instructions, setInstructions] = useState(existing?.steps.join('\n') ?? '');
  const [minutes, setMinutes] = useState(String(existing?.minutes ?? 30));
  const [servings, setServings] = useState(String(existing?.servings ?? 2));
  const [calories, setCalories] = useState(String(existing?.calories ?? 350));
  const [validation, setValidation] = useState<string | null>(null);
  const fields = [
    { label: 'Recipe title', value: title, set: setTitle, multiline: false, numeric: false },
    { label: 'Image URL', value: image, set: setImage, multiline: false, numeric: false },
    { label: 'Ingredients (one per line)', value: ingredients, set: setIngredients, multiline: true, numeric: false },
    { label: 'Step-by-step instructions (one per line)', value: instructions, set: setInstructions, multiline: true, numeric: false },
    { label: 'Cooking time (minutes)', value: minutes, set: setMinutes, multiline: false, numeric: true },
    { label: 'Servings', value: servings, set: setServings, multiline: false, numeric: true },
    { label: 'Calories per serving (approximate)', value: calories, set: setCalories, multiline: false, numeric: true },
  ];
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.65, base64: true });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImage(asset.base64 ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}` : asset.uri);
      }
    } catch { setValidation('The photo could not be opened. Try again or enter an image URL.'); }
  };
  const submit = async () => {
    const lines = (value: string) => value.split('\n').map(x => x.trim()).filter(Boolean);
    if (!title.trim() || !image.trim() || !lines(ingredients).length || !lines(instructions).length) {
      setValidation('Enter a title, an image, ingredients, and at least one instruction.'); return;
    }
    if (!/^(https?:\/\/|data:image\/|file:|content:)/i.test(image.trim())) {
      setValidation('Use a valid https image URL or upload a photo.'); return;
    }
    if (![minutes, servings, calories].every(x => Number.isFinite(Number(x)) && Number(x) > 0)) {
      setValidation('Cooking time, servings, and calories must be positive numbers.'); return;
    }
    setValidation(null);
    const recipe: Recipe = { id: existing?.id ?? `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: title.trim(), category: 'My Food', image: image.trim(),
      ingredients: lines(ingredients), steps: lines(instructions), minutes: Number(minutes), servings: Number(servings), calories: Number(calories), difficulty: existing?.difficulty ?? 'Easy' };
    const next = existing ? recipes.map(r => r.id === existing.id ? recipe : r) : [...recipes, recipe];
    if (await save({ recipes: next, favoriteIds })) navigation.goBack();
  };
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100} style={{ flex: 1, backgroundColor: t.background }}>
    <ScrollView testID="recipe-form" contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 60 }}>
      {image ? <RecipeImage uri={image} /> : null}
      <ActionButton id="upload-image" label="Upload image" disabled={busy} onPress={() => void pickImage()} />
      {fields.map((field, index) => <View key={field.label} style={{ gap: 8 }}>
        <Text style={{ color: t.text, fontSize: 17, fontWeight: '500' }}>{field.label}</Text>
        <TextInput testID={`recipe-field-${index}`} accessibilityLabel={field.label} value={field.value} onChangeText={field.set} editable={!busy} multiline={field.multiline}
          keyboardType={field.numeric ? 'numeric' : 'default'} autoCapitalize={field.label === 'Image URL' ? 'none' : 'sentences'}
          style={{ fontSize: 17, color: t.text, backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 12, padding: 14, minHeight: field.multiline ? 120 : 50, textAlignVertical: 'top' }} />
      </View>)}
      <ErrorMessage message={validation || error} />
      <ActionButton id="save-recipe" label={busy ? 'Saving…' : 'Save Recipe'} disabled={busy} onPress={() => void submit()} />
      <ActionButton id="cancel-recipe" label="Cancel" danger disabled={busy} onPress={() => navigation.goBack()} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
