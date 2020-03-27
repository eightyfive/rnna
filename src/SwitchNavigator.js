import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = config.backBehavior || 'none';
  }

  mount() {
    this.route.mount();
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
    const name = this.getPathNavigator(path);

    if (name !== this.route.name) {
      this.history.push(name);
      this.route.mount();
    }

    const next = this.getNextPath(path);

    if (next) {
      this.route.go(next, params, fromId);
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

  push(name, params, fromId) {
    this.route.push(name, params, fromId);
  }

  pop(n = 1) {
    this.route.pop(n);
  }

  popToTop(fromId) {
    this.route.popToTop(fromId);
  }

  popToIndex(index) {
    this.route.popToIndex(index);
  }

  dismiss(fromId) {
    this.route.dismiss(fromId);
  }
}
