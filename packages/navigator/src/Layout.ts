import { Options } from 'react-native-navigation';
import { Props, ReactComponent } from './types';

export abstract class Layout<LayoutT, LayoutOptions = Options> {
  static layoutIndex = 0;

  id: string;
  options: LayoutOptions | undefined;

  constructor(options?: LayoutOptions) {
    this.id = `${this.constructor.name}${++Layout.layoutIndex}`;
    this.options = options;
  }

  abstract mount(props?: Props): void;

  abstract getLayout(props?: Props): LayoutT;

  abstract getRoot(props?: Props): Record<string, LayoutT>;

  abstract register(Provider?: ReactComponent): void;
}
