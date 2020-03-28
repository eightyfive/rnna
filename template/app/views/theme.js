import { StyleSheet } from 'react-native';
import SpaceSheet from 'react-native-spacesheet';
import color from 'color';

const spacing = 4;

const space = new SpaceSheet(spacing);

export const s = space.styles;
export const ss = space.sheets;

export const sheet = StyleSheet.create({
  content: {
    ...s.p3,
    flex: 1,
  },
  contentContainer: {
    ...s.p3,
  },
});

// Credits:
// https://github.com/callstack/react-native-paper/blob/master/src/styles/DefaultTheme.tsx
// https://github.com/callstack/react-native-paper/blob/master/src/styles/colors.tsx
const black = '#000000';
const white = '#ffffff';
const pinkA400 = '#f50057';

export const colors = {
  primary: '#6200ee',
  accent: '#03dac4',
  background: '#f6f6f6',
  surface: white,
  error: '#B00020',
  text: black,
  onBackground: '#000000',
  onSurface: '#000000',
  disabled: color(black)
    .alpha(0.26)
    .rgb()
    .string(),
  placeholder: color(black)
    .alpha(0.54)
    .rgb()
    .string(),
  backdrop: color(black)
    .alpha(0.5)
    .rgb()
    .string(),
  notification: pinkA400,
};

export default {
  dark: false,
  roundness: 4,
  fonts: {}, // TODO
  animation: {
    scale: 1.0,
  },
};
