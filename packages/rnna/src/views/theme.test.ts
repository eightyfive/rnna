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
  sizes: {
    s: 4,
    m: 8,
    l: 16,
    roundness: 10,
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
      col: 5,
    },
    row: {
      mt: 'l',
      row: 8,
      borderRadius: 'roundness',
    },
    text: {
      backgroundColor: 'accent',
      color: 'onAccent',
      mb: 'l',
    },
    error: {
      backgroundColor: 'negative',
      color: 'positive',
    },
  });

  expect(styles.box).toEqual({
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    paddingHorizontal: sizes.s,
    marginVertical: sizes.m,
    marginLeft: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });

  expect(styles.row).toEqual({
    marginTop: sizes.l,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: sizes.roundness,
  });

  expect(styles.text).toEqual({
    backgroundColor: colors.accent,
    color: colors.onAccent,
    marginBottom: sizes.l,
  });

  expect(styles.error).toEqual({
    backgroundColor: colors.negative,
    color: colors.positive,
  });
});
