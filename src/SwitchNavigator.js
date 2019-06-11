import Navigator from "./Navigator";
import ModalNavigator from "./ModalNavigator";

export default class SwitchNavigator extends Navigator {
  constructor(navigators, config = {}) {
    super();

    this.name = config.name;
    this.navigators = navigators;
    this.history = [];
  }

  getActiveId() {
    return this.history[this.history.length - 1];
  }

  getActive() {
    return this.getNavigator(this.getActiveId());
  }

  isActive(name) {
    return this.getActiveId() === name;
  }

  getInitialNavigator() {
    return this.navigators[0];
  }

  mount() {
    const navigator = this.getInitialNavigator();

    this.navigate(navigator.getName());
  }

  getNavigator(name) {
    const navigator = this.navigators.find(nav => nav.getName() === name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${name}`);
    }

    return navigator;
  }

  navigate(path, params, fromId) {
    const [navigatorName, name] = this.splitPath(path);
    const navigator = this.getNavigator(navigatorName);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${navigator} (${path})`);
    }

    if (!this.isActive(navigatorName)) {
      this.history.push(navigatorName);

      navigator.mount();
    }

    if (name) {
      navigator.navigate(name, params, fromId);
    }
  }

  goBack(fromId) {
    const navigator = this.getActive();
    const isModal = navigator instanceof ModalNavigator;

    try {
      navigator.goBack(fromId);

      if (isModal) {
        this.history.pop();
      }
    } catch (err) {
      this.switchBack();
    }
  }

  switchBack() {
    if (this.history.length === 1) {
      throw new Error("No route to switch back to");
    }

    const name = this.history.pop();
    const navigator = this.getNavigator(name);

    navigator.mount();
  }

  push(name, params, fromId) {
    const navigator = this.getActive();

    if (!navigator.push) {
      throwNotSupported(navigator, "push");
    }

    navigator.push(name, params, fromId);
  }

  pop(n = 1) {
    const navigator = this.getActive();

    if (!navigator.pop) {
      throwNotSupported(navigator, "pop");
    }

    navigator.pop(n);
  }

  popToTop(fromId) {
    const navigator = this.getActive();

    if (!navigator.popToTop) {
      throwNotSupported(navigator, "popToTop");
    }

    navigator.popToTop(fromId);
  }

  dismiss(fromId) {
    const navigator = this.getActive();

    if (!navigator.dismiss) {
      throwNotSupported(navigator, "dismiss");
    }

    navigator.dismiss(fromId);
  }
}

function throwNotSupported(navigator, method) {
  throw new Error(
    `${navigator.constructor.name} does not support \`${method}\``
  );
}
