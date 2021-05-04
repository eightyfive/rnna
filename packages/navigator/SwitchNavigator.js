import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(config = {}) {
    super({}, config.options || {}, config);

    this.navigators = new Map();

    this.backBehavior = config.backBehavior || 'none';
  }

  addRoute(name, route) {
    this.addNavigator(name, route);
  }

  addNavigator(name, navigator) {
    if (!(navigator instanceof Navigator)) {
      throw new Error('Switch route must be a `Navigator` instance');
    }

    if (!this.navigators.size) {
      this.initialRouteName = name;
    }

    this.navigators.set(name, navigator);
  }

  getRoute(name) {
    return this.getNavigator(name);
  }

  getNavigator(name) {
    return this.navigators.get(name);
  }

  mount(initialProps) {
    this.history = [this.initialRouteName];

    this.route.mount(initialProps);
  }

  getRoute(path) {
    const ids = path.split('/');

    if (ids.length === 1) {
      return super.getRoute(ids[0]);
    }

    let route = this;

    ids.forEach(id => {
      route = route.get(id);
    });

    return route;
  }

  render(path, props) {
    const [name, rest] = this.parsePath(path);

    if (this.navigatorName !== name) {
      const navigator = this.navigators.get(this.navigatorName);

      this.history.push(name);

      this.navigatorName = name;

      // Mount new name (navigator/component)
      navigator.mount(props);
    }

    if (rest) {
      const navigator = this.navigators.get(this.navigatorName);

      navigator.render(rest, props);
    }
  }

  goBack() {
    let navigator = this.navigators.get(this.navigatorName);

    try {
      navigator.goBack();
    } catch (err) {
      if (this.history.length > 1) {
        navigator.unmount();

        this.history.pop();
        this.navigatorName = Array.from(this.history).pop();

        navigator = this.navigators.get(this.navigatorName);

        this.render(this.navigatorName);
      } else {
        throw err;
      }
    }
  }
}
