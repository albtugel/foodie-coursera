import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Recipe } from '../model';
import { useTheme } from '../theme';

export function ActionButton({ label, id, onPress, disabled = false, danger = false }: {
  label: string; id: string; onPress: () => void; disabled?: boolean; danger?: boolean;
}) {
  const t = useTheme();
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => ({ padding: 14, minHeight: 48, borderRadius: 12, backgroundColor: danger ? t.surface : t.accent, opacity: disabled ? 0.45 : pressed ? 0.7 : 1, alignItems: 'center' })}>
    <Text style={{ color: danger ? t.danger : t.onAccent, fontSize: 16, fontWeight: '600' }}>{label}</Text>
  </Pressable>;
}

export function RecipeImage({ uri, height = 180 }: { uri: string; height?: number }) {
  const t = useTheme();
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [uri]);
  return failed || !uri ? <View style={{ height, backgroundColor: t.surface, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}><Text style={{ color: t.secondary }}>Image unavailable</Text></View> :
    <Image accessibilityLabel="Recipe photo" source={{ uri }} resizeMode="cover" onError={() => setFailed(true)} style={{ height, width: '100%', borderRadius: 12 }} />;
}

export function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const t = useTheme();
  return <Pressable testID={`recipe-${recipe.id}`} accessibilityRole="button" accessibilityLabel={`Open ${recipe.title}`} onPress={onPress}
    style={({ pressed }) => ({ backgroundColor: t.surface, borderRadius: 16, padding: 14, gap: 10, marginBottom: 16, opacity: pressed ? 0.7 : 1 })}>
    <RecipeImage uri={recipe.image} />
    <Text style={{ color: t.text, fontSize: 21, fontWeight: '600' }}>{recipe.title}</Text>
    <Text style={{ color: t.secondary, fontSize: 15 }}>{recipe.category} · {recipe.minutes} min · {recipe.difficulty}</Text>
  </Pressable>;
}

export function ErrorMessage({ message }: { message: string | null }) {
  const t = useTheme();
  return message ? <Text selectable accessibilityRole="alert" style={{ color: t.danger, padding: 12, fontSize: 16 }}>{message}</Text> : null;
}
