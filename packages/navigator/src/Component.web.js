import { AppRegistry } from 'react-native';

import Registry from './Registry';
import Layout from './Layout';

export default class Component extends Layout {
  constructor(id, options = {}) {
    super();

    this.id = id;
    this.name = id;
    this.options = options;
    this.passProps = {};
    this.rootTag = options.rootTag || document.getElementById('root');
  }

  static register(componentId, componentName, ReactComponent, options = {}) {
    Registry.register(componentId, componentName, ReactComponent);

    return new Component(componentId, componentName, options);
  }

  mount(initialProps) {
    AppRegistry.unmountApplicationComponentAtRootTag(this.rootTag);

    this.update(initialProps);
  }

  unmount() {}

  update(props) {
    this.passProps = props;

    AppRegistry.runApplication(this.id, {
      initialProps: props,
      rootTag: this.rootTag,
    });
  }
}
