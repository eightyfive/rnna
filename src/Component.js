import { Navigation } from 'react-native-navigation';

import Mountable from './Mountable';

export default class Component extends Mountable {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  unmount(fromId) {}

  getLayout(passProps, defaultOptions) {
    const layout = {
      id: this.id,
      name: this.id,
    };

    if (this.options || defaultOptions) {
      layout.options = Object.assign({}, defaultOptions, this.options);
    }

    if (passProps) {
      layout.passProps = passProps;
    }

    return { component: layout };
  }
}
