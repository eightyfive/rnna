import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class StackNavigator extends Navigator {
  constructor(routes, config = {}) {
    super();

    this.routes = routes;
    this.order = config.order || Object.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
    this.history = [];
    this.options = config.options;

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear,
    );
  }

  getNavigator(key) {
    const navigator = this.routes[key];

    if (!navigator) {
      throw new Error(`Unknown navigator: ${key}`);
    }

    return navigator;
  }

  getLayout(componentId) {
    const index = this.order.findIndex(id => id === componentId);
    const children = this.order.slice(0, index + 1);

    const layout = {
      children: children.map(id => this.getNavigator(id).getLayout()),
    };

    // TODO
    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  get active() {
    return this.history[this.history.length - 1];
  }

  handleDidDisappear = ({ componentId }) => {
    if (componentId === this.active) {
      // Native back button has been pressed
      this.history.pop();
    }
  };

  mount() {
    this.history = [this.initialRouteName];

    Navigation.setRoot({ root: this.getLayout(this.initialRouteName) });
  }

  navigate(toId, params, fromId) {
    const index = this.history.findIndex(id => id === toId);

    if (index !== -1) {
      this.popToIndex(index);
    } else {
      this.push(toId, params, fromId);
    }
  }

  goBack(fromId) {
    if (fromId !== this.active) {
      throw new Error(`goBack from mismatch: ${fromId} != ${this.active}`);
    }

    if (this.history.length === 1) {
      throw new Error('No route to go back to');
    }

    Navigation.pop(fromId);
    this.history.pop();
  }

  push(toId, params, fromId) {
    const navigator = this.getNavigator(toId);

    Navigation.push(fromId, navigator.getLayout(params));
    this.history.push(toId);
  }

  pop(n = 1) {
    const index = this.history.length - 1 - n;

    if (index < 0) {
      throw new Error(`Out of range popTo: ${n}`);
    }

    this.popToIndex(index);
  }

  popToIndex(index) {
    this.history.splice(index + 1);

    Navigation.popTo(this.history[index]);
  }

  popToTop(fromId) {
    this.history = [this.initialRouteName];

    Navigation.popToRoot(fromId);
  }
}
