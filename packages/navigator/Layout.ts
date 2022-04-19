import { Options } from 'react-native-navigation';

export type Props = object;

export abstract class Layout<LayoutType, RootKey extends string> {
  options: Options | object;

  constructor(options?: Options) {
    this.options = options || {};
  }

  hasOptions() {
    return Object.keys(this.options).length > 0;
  }

  abstract getLayout(props: Props): LayoutType;

  abstract getRoot(props: Props): Record<RootKey, LayoutType>;
}
