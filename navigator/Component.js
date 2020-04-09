import { Navigation } from 'react-native-navigation';

import Route from './Route';

export default class Component extends Route {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
    this.params = null;
  }

  mount(params) {
    Navigation.setRoot({ root: this.getLayout(params) });
  }

  unmount(fromId) {}

  getInitialLayout(params, defaultOptions) {
    return this.getLayout(params, defaultOptions);
  }

  getLayout(params, defaultOptions) {
    const layout = {
      id: this.id,
      name: this.id,
    };

    if (this.options || defaultOptions) {
      layout.options = Object.assign({}, defaultOptions, this.options);
    }

    if (params) {
      this.params = params;

      layout.passProps = params;
    }

    return { component: layout };
  }

  update(params) {
    this.params = params;

    Navigation.updateProps(this.id, params);
  }
}
