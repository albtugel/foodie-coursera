import { ColorValue, Platform, PlatformColor, useColorScheme } from 'react-native';

export function useTheme() {
  const dark = useColorScheme() === 'dark';
  return {
    background: Platform.select<ColorValue>({ ios: PlatformColor('systemBackground'), default: dark ? '#151515' : '#FFFFFF' })!,
    surface: Platform.select<ColorValue>({ ios: PlatformColor('secondarySystemBackground'), default: dark ? '#252525' : '#F3F4F6' })!,
    text: Platform.select<ColorValue>({ ios: PlatformColor('label'), default: dark ? '#F9FAFB' : '#202124' })!,
    secondary: Platform.select<ColorValue>({ ios: PlatformColor('secondaryLabel'), default: dark ? '#B6B6BE' : '#52525B' })!,
    border: dark ? '#47474E' : '#D1D5DB',
    accent: '#F59E0B',
    onAccent: '#17120B',
    danger: dark ? '#FF6961' : '#B42318',
    heart: '#CC2443',
  };
}
