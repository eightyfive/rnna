import _last from 'lodash.last';
import _take from 'lodash.take';
import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class StackNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.options = config.options;
    this.defaultOptions = config.defaultOptions;

    this.screenPoppedListener = events.registerComponentDidDisappearListener(
      this.handleScreenPopped,
    );
  }

  getInitialLayout(params) {
    // TOFIX: Here because of BottomTabs.children.getInitialLayout()
    this.history = [this.initialRouteName];

    return this.getLayout(params, this.initialRouteName);
  }

  getLayout(params, routeName) {
    const index = this.order.findIndex(name => name === routeName);
    const children = this.order.slice(0, index + 1);

    const layout = {
      children: children.map(name =>
        this.get(name).getInitialLayout(params, this.defaultOptions),
      ),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  handleScreenPopped = ({ componentId: id, componentName: name }) => {
    // Native back button has been pressed

    const active =
      !this.parent || (this.parent && this.parent.route.name === this.name);

    // If this navigator/route is active
    if (active) {
      // If popped was the last visible
      const visible = this.route && this.route.name === id;

      // If popped is not the first screen of Stack
      const initial = id === this.initialRouteName;

      // Then manual pop() of history (which is out of sync)
      if (visible && !initial) {
        this.history.pop();
      }
    }
  };

  mount(params) {
    Navigation.setRoot({ root: this.getInitialLayout(params) });
  }

  navigate(toId, params, fromId) {
    const index = this.history.findIndex(id => id === toId);

    if (index > 0) {
      this.popToIndex(index);
    } else if (index !== 0) {
      this.push(toId, params, fromId);
    }
  }

  goBack(fromId) {
    if (fromId !== this.route.name) {
      throw new Error(`goBack from mismatch: ${fromId} != ${this.route.name}`);
    }

    if (this.history.length === 1) {
      throw new Error('No route to navigate back to');
    }

    this.history.pop();

    Navigation.pop(fromId);
  }

  push(toId, params, fromId) {
    const component = this.get(toId);

    this.history.push(toId);

    Navigation.push(fromId, component.getLayout(params, this.defaultOptions));
  }

  pop(n = 1) {
    const index = this.history.length - 1 - n;

    if (index < 0) {
      throw new Error(`Out of range popTo: ${n}`);
    }

    this.popToIndex(index);
  }

  popToIndex(index) {
    this.history = _take(this.history, index + 1);

    const toId = _last(this.history);

    Navigation.popTo(toId);
  }

  popToTop() {
    const fromId = this.route.name;

    // Reset history
    this.history = [this.initialRouteName];

    Navigation.popToRoot(fromId);
  }

  getComponent() {
    if (!this.route) {
      return null;
    }

    return this.route;
  }
}
