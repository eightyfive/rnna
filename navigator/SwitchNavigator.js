import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = config.backBehavior || 'none';
  }

  mount(params) {
    this.history = [this.initialRouteName];

    this.route.mount(params);
  }

  get(path) {
    const names = path.split('/');

    if (names.length === 1) {
      return super.get(names[0]);
    }

    let route = this;

    names.forEach(name => {
      route = route.get(name);
    });

    return route;
  }

  go(path, params, fromId) {
    const [name, rest] = this.parsePath(path);

    if (this.route.name !== name) {
      const route = this.get(name);

      this.history.push(name);

      // Mount new route
      route.mount(params);
    }

    if (rest) {
      this.route.go(rest, params, fromId);
    }
  }

  goBack(fromId) {
    try {
      this.route.goBack(fromId);
    } catch (err) {
      if (this.history.length > 1) {
        this.route.unmount(fromId);

        this.history.pop();
        this.go(this.route.name);
      } else {
        throw err;
      }
    }
  }
}
