import { Navigation } from 'react-native-navigation';

import { Stack } from './Layouts';

export default class StackNavigator extends Stack {
  constructor(components, config = {}) {
    super(components, config);

    this.history = [];

    this.addListener('ScreenPopped', this.handleScreenPopped);
  }

  get componentName() {
    return Array.from(this.history).pop() || null;
  }

  get component() {
    return this.components.get(this.componentName) || null;
  }

  handleScreenPopped = ({ componentId: id }) => {
    try {
      const component = this.getComponentById(id);

      if (this.componentName === component.name) {
        this.history.pop();
      }
    } catch (err) {
      // Ignore
    }
  };

  init() {
    this.history = [this.initialName];
  }

  mount(props) {
    super.mount(props);

    this.init();
  }

  push(name, props) {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (!this.components.has(name)) {
      throw new Error(`Component not found: ${name}`);
    }

    const componentTo = this.components.get(name);

    Navigation.push(this.component.id, componentTo.getRoot(props));

    this.history.push(name);
  }

  pop() {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    Navigation.pop(this.component.id);

    this.history.pop();
  }

  popTo(id) {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    const component = this.getComponentById(id);

    if (!this.history.includes(component.name)) {
      throw new Error(`Component not in stack: ${component.id}`);
    }

    Navigation.popTo(component.id);

    const index = this.history.indexOf(component.name);

    this.history.splice(index + 1);
  }

  popToRoot() {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Already stack root');
    }

    Navigation.popToRoot(this.component.id);

    this.history = [this.initialName];
  }
}
