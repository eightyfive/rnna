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
    this.history = [this.initialName];

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId, componentName }) => {
    // A pop() happened outside of the Stack
    // We need to sync history

    const component = this.components.get(componentName);

    if (component && component.id === componentId) {
      const index = this.history.findIndex(name => name === componentName);

      if (index > -1 && index < this.history.length - 1) {
        // Sync history
        this.history.splice(index + 1);
      }
    }
  };

  get componentName() {
    return Array.from(this.history).pop();
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getInitialLayout(initialProps) });
  }

  getInitialLayout(initialProps) {
    return this.getLayout(initialProps, this.initialName);
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

  push(toName, props) {
    const componentFrom = this.components.get(this.componentName);
    const componentTo = this.components.get(toName);

    this.history.push(toName);

    Navigation.push(componentFrom.id, componentTo.getLayout(props));
  }

  pop(n = 1) {
    const len = this.history.length;
    const newLen = len - n;

    if (n < 1 || newLen < 1) {
      throw new Error(`Invalid pop number: ${n} (${len})`);
    }

    if (n === 1) {
      const name = this.history.pop();
      const componentFrom = this.components.get(name);

      Navigation.pop(componentFrom.id);
    } else {
      this.popToIndex(newLen - 1);
    }
  }

  popToIndex(index) {
    const len = this.history.length;

    if (index < 0 || index > len - 1) {
      throw new Error(`Invalid pop index: ${index} (${len})`);
    }

    if (index === 0) {
      this.popToRoot();
    } else {
      this.history.splice(index + 1);

      const componentTo = this.components.get(this.componentName);

      this.popTo(componentTo.id);
    }
  }

  popTo(toId) {
    Navigation.popTo(toId);
  }

  popToRoot() {
    const componentFrom = this.components.get(this.componentName);

    // Reset history
    this.history = [this.initialName];

    Navigation.popToRoot(componentFrom.id);
  }
}
