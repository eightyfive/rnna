import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = config.backBehavior || 'none';
  }

  mount() {
    this.history = [];
    this.navigate(this.initialRouteName);
  }

  navigate(route, params, fromId) {
    const name = this.getRouteNavigator(route);

    if (name !== this.routeName) {
      this.history.push(name);

      const navigator = this.getRoute(name);
      navigator.mount();
    }

    const next = this.getRouteNext(route);

    if (next) {
      this.active.navigate(next, params, fromId);
    }
  }

  goBack(fromId) {
    try {
      this.active.goBack(fromId);
    } catch (err) {
      if (this.history.length > 1) {
        this.active.unmount(fromId);

        this.history.pop();
        this.navigate(this.routeName);
      } else {
        throw err;
      }
    }
  }

  push(name, params, fromId) {
    this.active.push(name, params, fromId);
  }

  pop(n = 1) {
    this.active.pop(n);
  }

  popToTop(fromId) {
    this.active.popToTop(fromId);
  }

  popToIndex(index) {
    this.active.popToIndex(index);
  }

  dismiss(fromId) {
    this.active.dismiss(fromId);
  }
}
