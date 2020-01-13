import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class StackNavigator extends Navigator {
  constructor(stack, config = {}) {
    super();

    this.stack = stack;
    this.order = config.order || this.stack.getOrder();
    this.initialComponentId = config.initialRouteName || this.order[0];
    this.history = [];

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

    Navigation.setRoot({ root: this.getInitialLayout() });
  }

  getInitialLayout() {
    return this.stack.getLayout(this.initialComponentId);
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

    if (toId !== this.activeId) {
      Navigation.push(fromId, component.getLayout(params));
      this.history.push(toId);
    } else if (__DEV__) {
      console.warn(`Stack: Trying to push the same screen "${toId}" twice`);
    }
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
    this.history = [this.initialComponentId];

    Navigation.popToRoot(fromId);
  }
}
