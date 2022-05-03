import { Options } from 'react-native-navigation';
import { Props, ReactComponent } from './types';

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

  abstract register(Provider?: ReactComponent): void;
}
