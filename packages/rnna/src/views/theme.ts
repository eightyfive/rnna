import {
  ColorValue,
  ImageStyle as RNImageStyle,
  StyleSheet,
  TextStyle as RNTextStyle,
  ViewStyle as RNViewStyle,
} from 'react-native';
import _mapValues from 'lodash.mapvalues';

type ThemeT = {
  colors: Record<string, ColorValue>;
  roundness: number;
  sizes: Record<string, number>;
};

type SpacingProperty =
  | 'm'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'my'
  | 'mx'
  | 'p'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'py'
  | 'px';

type RNSpacingProperty =
  | 'margin'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginVertical'
  | 'marginHorizontal'
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingVertical'
  | 'paddingHorizontal';

const spacingShorthands: Record<SpacingProperty, RNSpacingProperty> = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  my: 'marginVertical',
  mx: 'marginHorizontal',
  //
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  py: 'paddingVertical',
  px: 'paddingHorizontal',
};

type Colors = Record<string, ColorValue>;

type Sizes = Record<string, number>;

type SpacingStyle<S extends Sizes> = Partial<Record<SpacingProperty, keyof S>>;

type FlexStyle = {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

interface ViewStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNViewStyle, 'backgroundColor' | 'borderColor'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
}

interface TextStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNTextStyle, 'backgroundColor' | 'borderColor' | 'color'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  color?: keyof C;
}

interface ImageStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNImageStyle, 'backgroundColor' | 'borderColor'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
}

type RNStyle = RNViewStyle | RNTextStyle | RNImageStyle;

type Style<S extends Sizes, C extends Colors> =
  | ViewStyle<S, C>
  | TextStyle<S, C>
  | ImageStyle<S, C>;

type NamedStyles<S extends Sizes, C extends Colors, T> = {
  [P in keyof T]: Style<S, C>;
};

export function createTheme<TT extends ThemeT>({
  colors,
  roundness,
  sizes,
}: TT) {
  return {
    colors,
    roundness,
    sizes,
    //
    createStyles<
      T extends
        | NamedStyles<TT['sizes'], TT['colors'], T>
        | NamedStyles<TT['sizes'], TT['colors'], any>
    >(
      styles: T | NamedStyles<TT['sizes'], TT['colors'], T>,
    ): StyleSheet.NamedStyles<T> {
      return StyleSheet.create(
        _mapValues(styles, style => {
          const result: RNStyle = {};

          for (let key in style) {
            const value = style[key];

            if (
              key === 'backgroundColor' ||
              key === 'borderColor' ||
              key === 'color'
            ) {
              const color = colors[value as keyof typeof colors];

              if (!color && __DEV__) {
                console.warn(`Color not found: ${color}`);
              }

              // @ts-ignore
              result[key] = color || (value as ColorValue);
            } else if (key in spacingShorthands) {
              const rnSpacingProperty =
                spacingShorthands[key as SpacingProperty];

              if (typeof value === 'number') {
                result[rnSpacingProperty] = value;
              } else {
                const size = sizes[value as keyof typeof sizes];

                if (!size && __DEV__) {
                  console.warn(`Size not found: ${value}`);
                }

                result[rnSpacingProperty] = size || (value as string | number);
              }
            } else {
              // @ts-ignore
              result[key] = value;
            }
          }

          return result;
        }),
      );
    },
  };
}
