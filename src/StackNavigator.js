import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(name, stack, config = {}) {
    super(name);

    this.stack = stack;
    this.order = config.order || this.stack.getOrder();
    this.initialComponentId = config.initialRouteName || this.order[0];
    this.history = [];

    const events = Navigation.events();

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear,
    );
  }

  get activeId() {
    return this.history[this.history.length - 1];
  }

  handleDidDisappear = ({ componentId }) => {
    if (componentId === this.activeId) {
      // FIXME: Hacky
      // Native back button has been pressed
      this.history.pop();
    }
  };

  mount() {
    this.history = [this.initialComponentId];
    Navigation.setRoot({ root: this.stack.getInitialLayout() });
  }

  navigate(toId, params, fromId) {
    const index = this.history.findIndex(componentId => componentId === toId);

    if (index !== -1) {
      this.popToIndex(index);
    } else {
      this.push(toId, params, fromId);
    }
  }

  goBack(fromId) {
    if (fromId !== this.activeId) {
      throw new Error(`goBack from mismatch: ${fromId} != ${this.activeId}`);
    }

    if (this.history.length === 1) {
      throw new Error('No route to go back to');
    }

    Navigation.pop(fromId);
    this.history.pop();
  }

  push(toId, params, fromId) {
    const component = this.stack.getChild(toId);

    if (!component) {
      throw new Error(`Unknown stack child: ${toId}`);
    }

    Navigation.push(fromId, component.getLayout(params));
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

    const componentId = this.history[index];

    Navigation.popTo(componentId);
  }

  popToTop(fromId) {
    Navigation.popToRoot(fromId);
  }
}
