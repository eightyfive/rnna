import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(config = {}) {
    super(config);

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    // A pop() happened outside of the StackNavigator
    // We need to sync history

    const componentName = this.findComponentNameById(componentId);

    if (componentName) {
      const componentIndex = this.findRouteIndexByName(componentName);

      if (componentIndex > 1 && this.routeName !== componentName) {
        // Sync history
        this.history.splice(componentIndex + 1);
      }
    }
  };

  addRoute(name, component) {
    if (!(component instanceof Component)) {
      throw new Error('Stack route must be a `Component` instance');
    }

    super.addRoute(name, component);
  }

  getComponents() {
    return Array.from(this.routes.values());
  }

  getInitialLayout(props) {
    // TOFIX:
    // Here because of BottomTabs.children.getInitialLayout()
    // Should be in Stack.mount
    this.history = [this.initialRouteName];

    return this.getLayout(props, this.initialRouteName);
  }

  getLayout(props, componentName) {
    const order = Array.from(this.routes.keys());
    const index = order.findIndex(name => name === componentName);
    const componentNames = order.slice(0, index + 1);

    const layout = {
      children: componentNames.map(name =>
        this.getRoute(name).getLayout(props),
      ),
      options: { ...this.options },
    };

    return { stack: layout };
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getInitialLayout(initialProps) });
  }

  push(toName, props) {
    const componentFrom = this.getRoute();
    const componentTo = this.getRoute(toName);

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
      const componentFrom = this.getRoute(name);

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

      const componentTo = this.getRoute();

      this.popTo(componentTo.id);
    }
  }

  popTo(toId) {
    Navigation.popTo(toId);
  }

  popToRoot() {
    const componentFrom = this.getRoute();

    // Reset history
    this.history = [this.initialRouteName];

    Navigation.popToRoot(componentFrom.id);
  }

  render(componentName, props) {
    const index = this.history.findIndex(name => name === componentName);

    if (this.routeName === componentName) {
      // Update current component
      const component = this.getRoute();

      component.render(props);
    } else if (index === -1) {
      // Push new screen
      this.push(componentName, props);
    } else {
      // Pop to previous screen
      this.popToIndex(index);
    }
  }

  goBack() {
    this.pop();
  }
}
