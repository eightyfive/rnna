import { AppRegistry } from 'react-native';

import Layout from './Layout';

export default class Component extends Layout {
  constructor(id, name, options = {}) {
    super();

    this.id = id;
    this.name = name;
    this.options = options;
    this.passProps = {};
    this.rootTag = options.rootTag || document.getElementById('root');
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
