import _last from 'lodash.last';
import _take from 'lodash.take';
import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    this.defaultOptions = config.defaultOptions || {};
    this.componentIds = new Map();

    for (const [name, component] of this.routes) {
      this.componentIds.set(name, component.id);
    }

    // Event listeners
    this.listeners = {
      _didDisappear: [],
    };

    this.addListener('_didDisappear', this.handleDidDisappear.bind(this));

    this.listen('ComponentDidDisappear', '_didDisappear');
  }

  handleDidDisappear({ componentId: id }) {
    // A pop() happened outside of the StackNavigator
    // We need to sync history

    // Nothing to pop
    if (!this.route || this.history.length === 1) {
      return;
    }

    if (id !== this.route.id) {
      return;
    }

    // If navigator is active
    let active = true;

    if (this.parent) {
      active = this.id === this.parent.route.id;
    }

    if (active) {
      // console.log('didDisappear', id, name, this.history);
      this.history.pop();
    }
  }

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

  push(toName, params, fromId) {
    const component = this.get(toName);

    this.history.push(toName);

    Navigation.push(fromId, component.getLayout(params, this.defaultOptions));
  }

  pop(fromId) {
    if (this.history.length === 1) {
      throw new Error('No route to navigate back to');
    }

    this.history.pop();

    Navigation.pop(fromId);
  }

  popTo(toId) {
    Navigation.popTo(toId);
  }

  popToRoot() {
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

  navigate(toName, params, fromId) {
    const index = this.history.findIndex(name => name === toName);

    if (index === -1) {
      this.push(toName, params, fromId);
    } else if (index >= 1) {
      this.popToIndex(index);
    }
  }

  goBack(fromId) {
    this.pop(fromId);
  }
}
