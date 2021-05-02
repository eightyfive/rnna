import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    this.backBehavior = config.backBehavior || 'none';
  }

  mount(initialProps) {
    this.history = [this.initialRouteName];

    this.route.mount(initialProps);
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

  render(path, props) {
    const [id, rest] = this.parsePath(path);

    if (this.route.id !== id) {
      const route = this.get(id);

      this.history.push(id);

      // Mount new route
      route.mount(props);
    }

    if (rest) {
      this.route.render(rest, props);
    }
  }

  goBack() {
    try {
      this.route.goBack();
    } catch (err) {
      if (this.history.length > 1) {
        this.route.unmount();

        this.history.pop();
        this.render(this.route.id);
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
