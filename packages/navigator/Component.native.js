import { Navigation } from 'react-native-navigation';

import Route from './Route';

export default class Component extends Route {
  constructor(id, name, options = {}) {
    super();

    this.id = id;
    this.name = name;
    this.options = options;
    this.passProps = {};
  }

  static registry = new Map();

  static register(
    componentName,
    ReactComponent,
    options = {},
    parentId = null,
  ) {
    Navigation.registerComponent(componentName, () => ReactComponent);

    const componentId = parentId
      ? `${parentId}/${componentName}`
      : componentName;

    Component.registry.set(componentId, ReactComponent);

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

  render(props) {
    this.passProps = props;

    Navigation.updateProps(this.id, props);
  }
}
