import { ComponentClass, FunctionComponent, PropsWithChildren } from 'react';
import { Options } from 'react-native-navigation';

export type Props = Record<string, string | number | boolean>;

export type ReactComponent<P = {}> =
  | FunctionComponent<PropsWithChildren<P>>
  | ComponentClass<PropsWithChildren<P>>;

export type ScreenComponent = (FunctionComponent | ComponentClass) & {
  options?: Options;
};
