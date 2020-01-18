import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class StackNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.options = config.options;
    this.defaultOptions = config.defaultOptions;

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear,
    );
  }

  getComponent(name) {
    return this.getNavigator(name);
  }

  getInitialLayout() {
    return this.getLayout(this.initialRouteName);
  }

  getLayout(routeName) {
    const index = this.order.findIndex(name => name === routeName);
    const children = this.order.slice(0, index + 1);

    const layout = {
      children: children.map(name =>
        this.getComponent(name).getLayout(null, this.defaultOptions),
      ),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  handleDidDisappear = ({ componentId }) => {
    if (componentId === this.routeName) {
      // Native back button has been pressed
      this.history.pop();
    }
  };

  mount() {
    this.history = [this.initialRouteName];

    Navigation.setRoot({ root: this.getInitialLayout() });
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
    if (fromId !== this.routeName) {
      throw new Error(`goBack from mismatch: ${fromId} != ${this.routeName}`);
    }

    if (this.history.length === 1) {
      throw new Error('No route to go back to');
    }

    Navigation.pop(fromId);
    this.history.pop();
  }

  push(toId, params, fromId) {
    const component = this.getNavigator(toId);

    Navigation.push(fromId, component.getLayout(params, this.defaultOptions));
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
