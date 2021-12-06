import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Layout from './Layout';

export default class Stack extends Layout {
  constructor(components, config = {}) {
    super(config);

    this.components = new Map(Object.entries(components));

    for (const component of this.components.values()) {
      if (!(component instanceof Component)) {
        throw new TypeError('Invalid argument: Only components allowed');
      }
    }

    this.order = Array.from(this.components.keys());
    this.initialName = this.order[0];
    this.name = null;
  }

  mount(props) {
    Navigation.setRoot({ root: this.getInitialLayout(props) });
  }

  getInitialLayout(props) {
    return this.getLayout(props, this.initialName);
  }

  getLayout(props, componentName) {
    const index = this.order.findIndex(name => name === componentName);
    const componentNames = this.order.slice(0, index + 1);

    const layout = {
      children: componentNames.map(name =>
        this.components.get(name).getLayout(props),
      ),
      options: { ...this.options },
    };

    return { stack: layout };
  }

  push(name, props) {
    if (!this.components.has(name)) {
      throw new Error(`Component not found: ${name}`);
    }

    const componentFrom = this.components.get(this.name);
    const componentTo = this.components.get(name);

    Navigation.push(componentFrom.id, componentTo.getLayout(props));

    this.name = name;
  }

  pop() {
    const componentFrom = this.components.get(this.name);

    Navigation.pop(componentFrom.id);
  }

  popTo(id) {
    Navigation.popTo(id);
  }

  popToRoot() {
    const componentFrom = this.components.get(this.componentName);

    Navigation.popToRoot(componentFrom.id);
  }
}
