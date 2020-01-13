import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(navigators) {
    super();

    this.navigators = navigators;
    this.history = [];
  }

  get navigator() {
    return this.getNavigator(this.history[this.history.length - 1]);
  }

  getNavigator(name) {
    const navigator = this.navigators.find(nav => nav.name === name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${name}`);
    }

    return navigator;
  }

  mount() {
    const navigator = this.navigator || this.navigators[0];

    this.history = [];
    this.navigate(navigator.name);
  }

  navigate(route, params, fromId) {
    const name = this.getRouteNavigator(route);
    const navigator = this.getNavigator(name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${name} (${route})`);
    }

    if (this.navigator.name !== name) {
      this.history.push(name);
      navigator.mount();
    }

    const next = this.getRouteNext(route);

    if (next) {
      navigator.navigate(next, params, fromId);
    }
  }

  goBack(fromId) {
    try {
      this.navigator.goBack(fromId);
    } catch (err) {
      if (this.history.length > 1) {
        this.navigator.unmount(fromId);
        this.history.pop();

        this.navigate(this.history[this.history.length - 1]);
      } else {
        throw err;
      }
    }
  }

  push(name, params, fromId) {
    if (!this.navigator.push) {
      throwNotSupported(this.navigator, 'push');
    }

    this.navigator.push(name, params, fromId);
  }

  pop(n = 1) {
    if (!this.navigator.pop) {
      throwNotSupported(this.navigator, 'pop');
    }

    this.navigator.pop(n);
  }

  popToTop(fromId) {
    if (!this.navigator.popToTop) {
      throwNotSupported(this.navigator, 'popToTop');
    }

    this.navigator.popToTop(fromId);
  }

  dismiss(fromId) {
    if (!this.navigator.dismiss) {
      throwNotSupported(this.navigator, 'dismiss');
    }

    this.navigator.dismiss(fromId);
  }
}

function throwNotSupported(navigator, method) {
  if (__DEV__) {
    throw new Error(
      `${navigator.constructor.name} does not support \`${method}\``,
    );
  }
}
