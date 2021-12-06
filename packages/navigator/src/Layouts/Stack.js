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

    const order = Array.from(this.components.keys());

    this.initialName = order[0];
    this.name = null;
  }

  get component() {
    if (!this.name) {
      throw new Error('Stack not mounted');
    }

    return this.components.get(this.name);
  }

  getRoot(props) {
    const component = this.components.get(this.initialName);

    const layout = {
      children: [component.getRoot(props)],
      options: { ...this.options },
    };

    return { stack: layout };
  }

  push(name, props) {
    if (!this.components.has(name)) {
      throw new Error(`Component not found: ${name}`);
    }

    const componentTo = this.components.get(name);

    Navigation.push(this.component.id, componentTo.getLayout(props));

    this.name = name;
  }

  pop() {
    Navigation.pop(this.component.id);
  }

  popTo(id) {
    Navigation.popTo(id);
  }

  popToRoot() {
    Navigation.popToRoot(this.component.id);
  }
}
