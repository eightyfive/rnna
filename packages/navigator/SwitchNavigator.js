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
    const ids = path.split('/');

    if (ids.length === 1) {
      return super.get(ids[0]);
    }

    let route = this;

    ids.forEach(id => {
      route = route.get(id);
    });

    return route;
  }

  navigate(path, params, fromId) {
    const [id, rest] = this.parsePath(path);

    if (this.route.id !== id) {
      const route = this.get(id);

      this.history.push(id);

      // Mount new route
      route.mount(params);
    }

    if (rest) {
      this.route.navigate(rest, params, fromId);
    }
  }

  goBack(fromId) {
    try {
      this.route.goBack(fromId);
    } catch (err) {
      if (this.history.length > 1) {
        this.route.unmount(fromId);

        this.history.pop();
        this.navigate(this.route.id);
      } else {
        throw err;
      }
    }
  }

  getComponent() {
    if (!this.route) {
      return null;
    }

    return this.route.getComponent();
  }
}