import { Navigation } from 'react-native-navigation';

import Route from './Route';

export default class Component extends Route {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  unmount(fromId) {}

  getInitialLayout(defaultOptions) {
    return this.getLayout(null, defaultOptions);
  }

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
