import { createTheme } from './theme';

const { colors, createStyles, sizes } = createTheme({
  colors: {
    primary: 'black',
    accent: 'white',
    positive: 'green',
    negative: 'red',
    //
    onPrimary: 'white',
    onAccent: 'black',
  },
  roundness: 10,
  sizes: {
    s: 4,
    m: 8,
    l: 16,
  },
});

// Theme
test('createStyles', () => {
  const styles = createStyles({
    box: {
      backgroundColor: 'primary',
      borderColor: 'accent',
      px: 's',
      my: 'm',
      marginLeft: 30,
    },
    text: {
      backgroundColor: 'primary',
      color: 'onPrimary',
      mb: 'l',
    },
    error: {
      backgroundColor: 'negative',
      color: 'positive',
    },
  });

  expect(styles.box).toHaveProperty('backgroundColor', colors.primary);
  expect(styles.box).toHaveProperty('borderColor', colors.accent);
  expect(styles.box).toHaveProperty('paddingHorizontal', sizes.s);
  expect(styles.box).toHaveProperty('marginVertical', sizes.m);
  expect(styles.box).toHaveProperty('marginLeft', 30);

  expect(styles.text).toHaveProperty('backgroundColor', colors.primary);
  expect(styles.text).toHaveProperty('color', colors.onPrimary);
  expect(styles.text).toHaveProperty('marginBottom', sizes.l);

  expect(styles.error).toHaveProperty('backgroundColor', colors.negative);
  expect(styles.error).toHaveProperty('color', colors.positive);
});
