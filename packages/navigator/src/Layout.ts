import { Navigation, Options } from 'react-native-navigation';
import { Props } from './types';

export abstract class Layout<LayoutT, OptionsT = Options> {
  id: string;
  options: OptionsT | undefined;

  constructor(id: string, options?: OptionsT) {
    this.id = id;
    this.options = options;
  }

  public abstract mount(props?: Props): void;

  protected abstract getLayout(props?: Props): LayoutT;

  protected abstract getRoot(props?: Props): Record<string, LayoutT>;

  protected abstract getOptions(options: OptionsT): Options;

  setOptions(options: OptionsT) {
    Navigation.mergeOptions(this.id, this.getOptions(options));
  }
}
