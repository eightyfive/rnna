import { Navigation, Options } from 'react-native-navigation';

import Emitter from '../Emitter';

export type Config = {
  options?: Options;
};

export type Props = Record<string, any>;

export type LayoutType = {
  id?: string;
  options?: Options;
  name?: string;
  passProps?: Props;
};

export abstract class Layout<RootType> extends Emitter {
  options: Options;

  constructor(config: Config = {}) {
    super();

    this.options = config.options || {};
  }

  mount(props: Props) {
    Navigation.setRoot({ root: this.getRoot(props) });
  }

  abstract getRoot(props: Props): RootType;
}
