import Route from './Route';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

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
      components.push(...route.getComponents());
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

    let navigator;

    if (this.history.isCurrent(name)) {
      navigator = this.getCurrentRoute();
    } else {
      // Unmount old navigator
      navigator = this.getCurrentRoute();

      if (navigator) {
        navigator.unmount();
      }

      // TODO ?
      // history.push(...) + goBack() ?
      this.history.reset(name);

      // Mount new navigator
      navigator = this.getCurrentRoute();
      navigator.mount(props);
    }

    navigator.render(childPath, props);
  }

  goBack() {
    // TODO ?
  }
}
