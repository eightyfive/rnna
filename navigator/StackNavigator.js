import _last from 'lodash.last';
import _take from 'lodash.take';
import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const o = {
  entries: Object.entries,
};

export default class StackNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.options = config.options;
    this.defaultOptions = config.defaultOptions;

    // Component IDs
    this.ids = new Map();

    for (const [name, component] of o.entries(routes)) {
      this.ids.set(name, component.id);
    }

    // Event listeners
    this.listeners = {
      _didDisappear: [],
    };

    this.addListener('_didDisappear', this.handleDidDisappear);

    this.listen('ComponentDidDisappear', '_didDisappear');
  }

  handleDidDisappear = ({ componentId: id }) => {
    // Native back button has been pressed

    const active =
      !this.parent || (this.parent && this.parent.route.id === this.id);

    // If this navigator/route is active
    if (active) {
      // If popped was the last visible
      const visible = this.route && this.route.id === id;

      // If popped is not the first screen of Stack
      const initial = id === this.initialRouteName;

      // Then manual pop() of history (which is out of sync)
      if (visible && !initial) {
        this.history.pop();
      }
    }
  };

  getInitialLayout(params) {
    // TOFIX:
    // Here because of BottomTabs.children.getInitialLayout()
    // Should be in Stack.mount
    this.history = [this.initialRouteName];

    return this.getLayout(params, this.initialRouteName);
  }

  getLayout(params, componentId) {
    const index = this.order.findIndex(id => id === componentId);
    const children = this.order.slice(0, index + 1);

    const layout = {
      children: children.map(id =>
        this.get(id).getLayout(params, this.defaultOptions),
      ),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  mount(params) {
    Navigation.setRoot({ root: this.getInitialLayout(params) });
  }

  navigate(toName, params, fromId) {
    if (this.route && this.route.name === toName) {
      // Refresh component
      this.route.update(params);
    } else {
      const index = this.history.findIndex(name => name === toName);

      const above = index > 0;
      const root = index === 0;

      if (above) {
        this.popToIndex(index);
      } else if (!root) {
        this.push(toName, params, fromId);
      }
    }
  }

  goBack(fromId) {
    if (fromId !== this.route.id) {
      throw new Error(`goBack from mismatch: ${fromId} != ${this.route.id}`);
    }

    if (this.history.length === 1) {
      throw new Error('No route to navigate back to');
    }

    this.history.pop();

    Navigation.pop(fromId);
  }

  push(toName, params, fromId) {
    const component = this.get(toName);

    this.history.push(toName);

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

    const toName = _last(this.history);
    const toId = this.ids.get(toName);

    Navigation.popTo(toId);
  }

  popToTop() {
    const fromId = this.route.id;

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
