import { Navigation } from 'react-native-navigation';
import shallowEqual from 'shallowequal';

import Layout from './Layout';

export default class Component extends Layout {
  constructor(id, name, options = {}) {
    super();

    this.id = id;
    this.name = name;
    this.options = options;
    this.props = {};
  }

  getRoot(props) {
    const layout = {
      id: this.id,
      name: this.name,
      options: { ...this.options },
    };

    if (props) {
      this.props = props;
    }

    layout.passProps = { ...this.props };

    return { component: layout };
  }

  update(props) {
    if (!shallowEqual(props, this.props)) {
      this.props = props;

      Navigation.updateProps(this.id, props);
    }
  }
}
