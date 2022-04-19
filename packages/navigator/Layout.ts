import { Options } from 'react-native-navigation';

export type Props = Record<string, string | number | boolean>;

export abstract class Layout<LayoutT, LayoutOptions = Options> {
  id: string;
  options: LayoutOptions | undefined;

  constructor(id: string, options?: LayoutOptions) {
    this.id = id;
    this.options = options;
  }

  abstract mount(props?: Props): void;

  abstract getLayout(props?: Props): LayoutT;

  abstract getRoot(props?: Props): Record<string, LayoutT>;
}
