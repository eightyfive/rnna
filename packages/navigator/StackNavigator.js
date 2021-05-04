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

    const component = this.getCurrentRoute();

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

  addRoute(name, component) {
    if (!(component instanceof Component)) {
      throw new Error('Stack route must be a `Component` instance');
    }

    super.addRoute(name, component);
  }

  getInitialLayout(props) {
    // TOFIX:
    // Here because of BottomTabs.children.getInitialLayout()
    // Should be in Stack.mount
    this.history = [this.initialRouteName];
    this.routeName = this.initialRouteName;

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
    const componentFrom = this.getCurrentRoute();
    const componentTo = this.getRoute(toName);

    this.history.push(toName);
    this.routeName = toName;

    Navigation.push(componentFrom.id, componentTo.getLayout(props));
  }

  pop(n = 1) {
    if (this.history.length === 1) {
      throw new Error('No route to render back to');
    }

    if (n === 1) {
      const componentFrom = this.getCurrentRoute();

      this.history.pop();
      this.routeName = Array.from(this.history).pop();

      Navigation.pop(componentFrom.id);
    } else {
      const index = this.history.length - 1 - n;

      if (index === -1) {
        throw new Error(`Out of range pop: ${n}`);
      }

      // popToIndex
      this.history = this.history.slice(0, index + 1);

      const toName = Array.from(this.history).pop();
      const componentTo = this.getRoute(toName);

      this.popTo(componentTo.id);
    }
  }

  popTo(toId) {
    const componentName = this.findRouteNameById(toId);

    this.routeName = componentName;

    Navigation.popTo(toId);
  }

  popToRoot() {
    const componentFrom = this.getCurrentRoute();

    // Reset history
    this.history = [this.initialRouteName];
    this.routeName = this.initialRouteName;

    Navigation.popToRoot(componentFrom.id);
  }

  render(toName, props) {
    const index = this.history.findIndex(name => name === toName);

    if (index === -1) {
      // Push new screen
      this.push(toName, props);
    } else if (index === this.history.length - 1) {
      const component = this.getCurrentRoute();

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
