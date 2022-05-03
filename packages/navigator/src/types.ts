import { ComponentClass, FunctionComponent, PropsWithChildren } from 'react';
import { Options } from 'react-native-navigation';

export type Props = Record<string, string | number | boolean>;

export type ReactComponent<P = {}> =
  | FunctionComponent<PropsWithChildren<P>>
  | ComponentClass<PropsWithChildren<P>>;

export type ScreenElement = (FunctionComponent | ComponentClass) & {
  options?: Options;
};

// Component
export type ComponentLayout = {
  id: string;
  name: string;
  options?: Options;
  passProps?: object;
};

// Stack
type StackChildLayout = {
  component: ComponentLayout;
};

export type StackLayout = {
  id: string;
  children: StackChildLayout[];
  options?: Options;
};

export type StackRoutes = Record<string, ScreenElement>;

export type StackConfig = Options & {
  parentId?: string;
};

// BottomTabs
type BottomTabsChildLayout = {
  stack: StackLayout;
};

export type BottomTabsLayout = {
  id: string;
  children: BottomTabsChildLayout[];
  options?: Options;
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
