import { Navigation } from 'react-native-navigation';

import Registry from './Registry';
import Layout from './Layout';

export default class Component extends Layout {
  constructor(id, name, options = {}) {
    super();

    this.id = id;
    this.name = name;
    this.options = options;
    this.passProps = {};
  }

  static register(componentId, componentName, ReactComponent, options = {}) {
    Registry.register(componentId, componentName, ReactComponent);

    return new Component(componentId, componentName, options);
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getLayout(initialProps) });
  }

  unmount() {}

  getLayout(props) {
    const layout = {
      id: this.id,
      name: this.name,
      options: { ...this.options },
    };

    if (props) {
      this.passProps = props;
    }

    layout.passProps = { ...this.passProps };

    return { component: layout };
  }

  update(props) {
    this.passProps = props;

    Navigation.updateProps(this.id, props);
  }
}
