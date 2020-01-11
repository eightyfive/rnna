import Navigator from './Navigator';

export default class SwitchNavigator extends Navigator {
  constructor(name, navigators) {
    super(name);

    this.navigators = navigators;
    this.history = [];
  }

  get active() {
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
    const navigator = this.active || this.navigators[0];

    this.history = [];
    this.navigate(navigator.name);
  }

  navigate(path, params, fromId) {
    const [name, rest] = this.splitPath(path);
    const navigator = this.getNavigator(name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${navigator} (${path})`);
    }

    if (this.active.name !== name) {
      this.history.push(name);
      navigator.mount();
    }

    if (rest) {
      navigator.navigate(rest, params, fromId);
    }
  }

  goBack(fromId) {
    try {
      this.active.goBack(fromId);
    } catch (err) {
      if (this.history.length > 1) {
        this.active.unmount(fromId);
        this.history.pop();

        this.navigate(this.history[this.history.length - 1]);
      } else {
        throw err;
      }
    }
  }

  push(name, params, fromId) {
    if (!this.active.push) {
      throwNotSupported(this.active, 'push');
    }

    this.active.push(name, params, fromId);
  }

  pop(n = 1) {
    if (!this.active.pop) {
      throwNotSupported(this.active, 'pop');
    }

    this.active.pop(n);
  }

  popToTop(fromId) {
    if (!this.active.popToTop) {
      throwNotSupported(this.active, 'popToTop');
    }

    this.active.popToTop(fromId);
  }

  dismiss(fromId) {
    if (!this.active.dismiss) {
      throwNotSupported(this.active, 'dismiss');
    }

    this.active.dismiss(fromId);
  }
}

function throwNotSupported(navigator, method) {
  if (__DEV__) {
    throw new Error(
      `${navigator.constructor.name} does not support \`${method}\``,
    );
  }
}
