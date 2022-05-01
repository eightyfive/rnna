import { ComponentClass, FunctionComponent, PropsWithChildren } from 'react';
import { Options } from 'react-native-navigation';

export type ReactComponent<P = {}> =
  | FunctionComponent<PropsWithChildren<P>>
  | ComponentClass<PropsWithChildren<P>>;

export type ScreenElement = (FunctionComponent | ComponentClass) & {
  options?: Options;
};

export type StackRoutes = Record<string, ScreenElement>;

export type StackConfig = Options & {
  parentId?: string;
  Provider?: ReactComponent;
};

export type BottomTabsRoutes = Record<
  string,
  Record<string, ScreenElement> & {
    config?: StackConfig;
  }
>;

export type BottomTabsConfig = Options & {
  parentId?: string;
  Provider?: ReactComponent;
};
