import { Navigation } from 'react-native-navigation';

import Route from './Route';

export default class Component extends Route {
  constructor(id, options = {}) {
    super();

    this.id = id;
    this.name = id;
    this.options = options;
    this.passProps = {};
  }

  mount(params) {
    Navigation.setRoot({ root: this.getLayout(params) });
  }

  unmount(fromId) {}

  getLayout(params, defaultOptions) {
    const layout = {
      id: this.id,
      name: this.name,
    };

    layout.options = Object.assign({}, defaultOptions, this.options);

    if (params) {
      this.passProps = params;

      layout.passProps = params;
    }

    return { component: layout };
  }

  update(params) {
    this.passProps = params;

    Navigation.updateProps(this.id, params);
  }
}
