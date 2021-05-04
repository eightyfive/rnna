import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  addRoute(name, navigator) {
    if (!(navigator instanceof Navigator)) {
      throw new Error('Switch route must be a `Navigator` instance');
    }

    super.addRoute(name, navigator);
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
      navigator.unmount();

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
