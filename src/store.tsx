import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { parseSavedData, SavedData } from './model';
import { useTheme } from './theme';
import { ActionButton } from './components/ui';

const key = 'foodie.saved.v1';
const slice = createSlice({
  name: 'foodie',
  initialState: { recipes: [], favoriteIds: [] } as SavedData,
  reducers: { replace: (_state, action: PayloadAction<SavedData>) => action.payload },
});
const store = configureStore({ reducer: { foodie: slice.reducer } });
type State = ReturnType<typeof store.getState>;
type Actions = { save: (next: SavedData) => Promise<boolean>; busy: boolean; error: string | null };
const context = createContext<Actions | null>(null);

export function useFoodie() {
  const state = useSelector((s: State) => s.foodie);
  const actions = useContext(context);
  if (!actions) throw new Error('Foodie provider is missing.');
  return { ...actions, ...state };
}

function StorageGate({ children }: React.PropsWithChildren) {
  const dispatch = useDispatch<typeof store.dispatch>();
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const load = useCallback(async () => {
    setError(null);
    try {
      dispatch(slice.actions.replace(parseSavedData(await AsyncStorage.getItem(key))));
      setReady(true);
    } catch { setError('Could not load saved recipes. Your data has not been changed.'); }
  }, [dispatch]);
  useEffect(() => { void load(); }, [load]);
  const save = async (next: SavedData) => {
    if (locked.current) return false;
    locked.current = true;
    setBusy(true);
    setError(null);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      dispatch(slice.actions.replace(next));
      return true;
    } catch {
      setError('Could not save changes. Please try again.');
      return false;
    } finally { locked.current = false; setBusy(false); }
  };
  if (!ready) return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: theme.background }}>
      {error ? <><Text accessibilityRole="alert" style={{ color: theme.danger }}>{error}</Text><ActionButton label="Retry loading" id="retry-loading" onPress={() => void load()} /></> : <ActivityIndicator accessibilityLabel="Loading saved recipes" />}
    </View>
  );
  return <context.Provider value={{ save, busy, error }}>{children}</context.Provider>;
}

export function FoodieProvider({ children }: React.PropsWithChildren) {
  return <Provider store={store}><StorageGate>{children}</StorageGate></Provider>;
}
