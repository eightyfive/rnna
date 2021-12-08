import Component from './Component';
import Layout from './Layout';

export default class Stack extends Layout {
  static layoutIndex = 0;

  constructor(components, config = {}) {
    super(config);

    this.components = new Map(Object.entries(components));

    for (const component of this.components.values()) {
      if (!(component instanceof Component)) {
        throw new TypeError('Invalid argument: Only components allowed');
      }
    }

    this.id = `Stack${Stack.layoutIndex++}`;
    this.order = Object.keys(components);
    this.initialName = this.order[0];
  }

  getComponentById(id) {
    for (const component of this.components) {
      if (component.id === id) {
        return component;
      }
    }

    throw new Error(`Component ID not found: ${id}`);
  }

  getRoot(props) {
    const component = this.components.get(this.order[0]);

    const layout = {
      id: this.id,
      children: [component.getRoot(props)],
      options: { ...this.options },
    };

    return { stack: layout };
  }
}
