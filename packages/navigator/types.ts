import { ComponentClass, FunctionComponent, PropsWithChildren } from 'react';
import { Options } from 'react-native-navigation';

export type ReactComponent =
  | FunctionComponent<PropsWithChildren<{}>>
  | ComponentClass<PropsWithChildren<{}>>;

export type ScreenElement = (FunctionComponent | ComponentClass) & {
  options?: Options;
};

export type StackRoutes = Record<string, ScreenElement>;

export type StackConfig = Options & {
  parentId?: string;
};

export type BottomTabsRoutes = Record<
  string,
  Record<string, ScreenElement> & {
    config?: StackConfig;
  }
>;

export type BottomTabsConfig = Options & {
  parentId?: string;
};
