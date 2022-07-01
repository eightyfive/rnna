import { Navigation, Options } from 'react-native-navigation';
import { Props } from './types';

export abstract class Layout<LayoutT, OptionsT = Options> {
  id: string;
  options: OptionsT | undefined;

  constructor(id: string, options?: OptionsT) {
    this.id = id;
    this.options = options;
  }

  protected abstract getOptions(options: OptionsT): Options;

  public abstract getLayout(props?: Props): LayoutT;

  public abstract getRoot(props?: Props): Record<string, LayoutT>;

  public abstract mount(props?: Props): void;

  public setOptions(options: OptionsT) {
    Navigation.mergeOptions(this.id, this.getOptions(options));
  }
}
