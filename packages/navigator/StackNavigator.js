import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(config = {}) {
    super({}, config.options || {}, config);

    this.components = new Map();
    this.history = [];
    this.initialComponentName = null;

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    // A pop() happened outside of the StackNavigator
    // We need to sync history

    const component = this.components.get(this.componentName);

    // Nothing to sync
    if (!component || this.history.length === 1) {
      return;
    }

    // Already current/visible
    if (component.id === componentId) {
      return;
    }

    // If this navigator is active
    let active;

    if (this.parent) {
      active = this.id === this.parent.route.id;
    } else {
      active = true;
    }

    if (active) {
      const componentName = componentId.split('/').pop();

      const index = this.history.findIndex(name => name === componentName);

      if (index > -1) {
        this.history = this.history.slice(0, index + 1);
      }
    }
  };

  addRoute(name, route) {
    this.addComponent(name, route);
  }

  addComponent(name, component) {
    if (!(component instanceof Component)) {
      throw new Error('Stack route must be a `Component` instance');
    }

    if (!this.components.size) {
      this.initialComponentName = name;
    }

    this.components.set(name, component);
  }

  findComponentNameById(id) {
    for (const [name, component] of this.components) {
      if (component.id === id) {
        return name;
      }
    }

    throw new Error(`Component not found: ${id}`);
  }

  getInitialLayout(props) {
    // TOFIX:
    // Here because of BottomTabs.children.getInitialLayout()
    // Should be in Stack.mount
    this.history = [this.initialComponentName];
    this.componentName = this.initialComponentName;

    return this.getLayout(props, this.initialComponentName);
  }

  getLayout(props, componentName) {
    const order = Array.from(this.components.keys());
    const index = order.findIndex(name => name === componentName);
    const componentNames = order.slice(0, index + 1);

    const layout = {
      children: componentNames.map(name =>
        this.components.get(name).getLayout(props),
      ),
      options: { ...this.options },
    };

    return { stack: layout };
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getInitialLayout(initialProps) });
  }

  push(toName, props) {
    const componentFrom = this.components.get(this.componentName);
    const componentTo = this.components.get(toName);

    this.history.push(toName);
    this.componentName = toName;

    Navigation.push(componentFrom.id, componentTo.getLayout(props));
  }

  pop(n = 1) {
    if (this.history.length === 1) {
      throw new Error('No route to render back to');
    }

    if (n === 1) {
      const componentFrom = this.components.get(this.componentName);

      this.history.pop();
      this.componentName = Array.from(this.history).pop();

      Navigation.pop(componentFrom.id);
    } else {
      const index = this.history.length - 1 - n;

      if (index === -1) {
        throw new Error(`Out of range pop: ${n}`);
      }

      // popToIndex
      this.history = this.history.slice(0, index + 1);

      const toName = Array.from(this.history).pop();
      const componentTo = this.components.get(toName);

      this.popTo(componentTo.id);
    }
  }

  popTo(toId) {
    const componentName = this.findComponentNameById(toId);

    this.componentName = componentName;

    Navigation.popTo(toId);
  }

  popToRoot() {
    const componentFrom = this.components.get(this.componentName);

    // Reset history
    this.history = [this.initialComponentName];
    this.componentName = this.initialComponentName;

    Navigation.popToRoot(componentFrom.id);
  }

  render(toName, props) {
    const index = this.history.findIndex(name => name === toName);

    if (index === -1) {
      // Push new screen
      this.push(toName, props);
    } else if (index === this.history.length - 1) {
      const component = this.components.get(this.componentName);

      // Update current screen
      component.render(props);
    } else {
      // Pop to previous screen
      this.popToIndex(index);
    }
  }

  goBack() {
    this.pop();
  }
}
