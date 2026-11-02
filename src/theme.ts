import { ColorValue, Platform, PlatformColor, useColorScheme } from 'react-native';

function semanticColor(name: string, fallback: string): ColorValue {
  return Platform.OS === 'ios' ? PlatformColor(name) : fallback;
}

export function useTheme() {
  const dark = useColorScheme() === 'dark';
  return {
    background: semanticColor('systemBackground', dark ? '#151515' : '#FFFFFF'),
    surface: semanticColor('secondarySystemBackground', dark ? '#252525' : '#F3F4F6'),
    text: semanticColor('label', dark ? '#F9FAFB' : '#202124'),
    secondary: semanticColor('secondaryLabel', dark ? '#B6B6BE' : '#52525B'),
    border: dark ? '#47474E' : '#D1D5DB',
    accent: '#F59E0B',
    onAccent: '#17120B',
    danger: dark ? '#FF6961' : '#B42318',
    heart: '#CC2443',
  };
}
