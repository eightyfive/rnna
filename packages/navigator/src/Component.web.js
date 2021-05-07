import { AppRegistry } from 'react-native';

import Route from './Route';

export default class Component extends Route {
  constructor(id, options = {}) {
    super();

    this.id = id;
    this.name = id;
    this.options = options;
    this.passProps = {};
    this.rootTag = options.rootTag || document.getElementById('root');
  }

  mount(initialProps) {
    AppRegistry.unmountApplicationComponentAtRootTag(this.rootTag);

    this.render(initialProps);
  }

  unmount() {}

  render(props) {
    this.passProps = props;

    AppRegistry.runApplication(this.id, {
      initialProps: props,
      rootTag: this.rootTag,
    });
  }
}