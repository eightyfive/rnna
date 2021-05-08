import Component from './Component';
import ModalNavigator from './ModalNavigator';
import Navigator from './Navigator';
import OverlayNavigator from './OverlayNavigator';
import Route from './Route';

export default class SwitchNavigator extends Navigator {
  addRoute(name, navigator) {
    if (!(navigator instanceof Route)) {
      throw new Error('Switch route must implement `Route`');
    }

    if (navigator instanceof ModalNavigator) {
      throw new Error('Switch route cannot be `ModalNavigator`');
    }

    if (navigator instanceof OverlayNavigator) {
      throw new Error('Switch route cannot be `OverlayNavigator`');
    }

    if (navigator instanceof SwitchNavigator) {
      throw new Error('Switch route cannot be `SwitchNavigator`');
    }

    super.addRoute(name, navigator);
  }

  getComponents() {
    const components = [];

    for (const route of this.routes.values()) {
      if (route instanceof Component) {
        components.push(route);
      } else {
        components.push(...route.getComponents());
      }
    }

    return components;
  }

  mount(initialProps) {
    this.history.reset(this.initialRouteName);

    // Mount initial navigator
    const navigator = this.getCurrentRoute();

    navigator.mount(initialProps);
  }

  render(path, props) {
    const [name, childPath] = this.readPath(path);

    let route = this.getCurrentRoute();

    if (!this.history.isCurrent(name)) {
      // Unmount old route
      if (route) {
        route.unmount();
      }

      // TODO ?
      // history.push(...) + goBack() ?
      this.history.reset(name);

      // Mount new route
      route = this.getCurrentRoute();
      route.mount(props);
    } else if (route instanceof Component) {
      route.render(props);
    }

    if (route instanceof Navigator) {
      route.render(childPath, props);
    }
  }

  goBack() {
    // TODO ?
  }
}
