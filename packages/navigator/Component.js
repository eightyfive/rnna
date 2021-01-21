import { Navigation } from 'react-native-navigation';
import _merge from 'lodash.merge';

import Route from './Route';

const o = {
  assign: Object.assign,
};

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

  unmount() {}

  getLayout(params, screenOptions = {}) {
    const layout = {
      id: this.id,
      name: this.name,
      options: { ...screenOptions },
    };

    _merge(layout.options, this.options);

    if (params) {
      this.passProps = params;
    }

    layout.passProps = this.passProps;

    return { component: layout };
  }

  update(params) {
    this.passProps = params;

    Navigation.updateProps(this.id, params);
  }
}
