import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(config = {}) {
    super(config);

    this.backBehavior = config.backBehavior || 'none';
  }

  addRoute(name, navigator) {
    if (!(navigator instanceof Navigator)) {
      throw new Error('Switch route must be a `Navigator` instance');
    }

    super.addRoute(name, navigator);
  }

  mount(initialProps) {
    this.history = [this.initialRouteName];
    this.routeName = this.initialRouteName;

    const navigator = this.getRoute(this.initialRouteName);

    navigator.mount(initialProps);
  }

  render(path, props) {
    const [name, rest] = this.parsePath(path);

    let navigator = this.getCurrentRoute();

    if (this.routeName !== name) {
      this.history.push(name);

      this.routeName = name;

      // Mount new name (navigator/component)
      navigator.mount(props);
    }

    navigator = this.getCurrentRoute();
    navigator.render(rest, props);
  }

  goBack() {
    let navigator = this.getCurrentRoute();

    try {
      navigator.goBack();
    } catch (err) {
      if (this.history.length > 1) {
        navigator.unmount();

        this.history.pop();
        this.routeName = Array.from(this.history).pop();

        navigator = this.getCurrentRoute();

        this.render(this.routeName);
      } else {
        throw err;
      }
    }
  }
}
