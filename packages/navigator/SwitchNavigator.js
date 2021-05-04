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
    const [name, rest] = this.parsePath(path);

    let navigator;

    if (!this.history.is(name)) {
      this.history.reset(name);

      // Mount new navigator
      navigator = this.getCurrentRoute();
      navigator.mount(props);
    }

    if (rest) {
      navigator = this.getCurrentRoute();
      navigator.render(rest, props);
    }
  }

  goBack() {
    // TODO ?
  }
}
