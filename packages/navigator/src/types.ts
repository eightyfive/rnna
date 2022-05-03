import { ComponentClass, FunctionComponent, PropsWithChildren } from 'react';
import { Options } from 'react-native-navigation';

export type ComponentLayout = {
  id: string;
  name: string;
  options?: Options;
  passProps?: object;
};

type StackChildLayout = {
  component: ComponentLayout;
};

export type StackLayout = {
  id: string;
  children: StackChildLayout[];
  options?: Options;
};

type BottomTabsChildLayout = {
  stack: StackLayout;
};

export type BottomTabsLayout = {
  id: string;
  children: BottomTabsChildLayout[];
  options?: Options;
};
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
