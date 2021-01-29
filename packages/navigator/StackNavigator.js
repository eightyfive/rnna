import _last from 'lodash.last';
import _take from 'lodash.take';
import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const o = Object;

export default class StackNavigator extends Navigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    this.componentIds = new Map();

    for (const [name, component] of this.routes) {
      this.componentIds.set(name, component.id);
    }

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId: id }) => {
    // A pop() happened outside of the StackNavigator
    // We need to sync history

    // Nothing to sync
    if (!this.route || this.history.length === 1) {
      return;
    }

    // Already current/visible
    if (this.route.id === id) {
      return;
    }

    // If this navigator is active
    let active = true;

    if (this.parent) {
      active = this.id === this.parent.route.id;
    }

    if (active) {
      // TOFIX: Ugly (Force '/' path convention ?)
      const componentId = id.split('/').pop();

      // console.log('didAppear', id, name, this.history);
      const index = this.history.findIndex(val => val === componentId);

      if (index > -1) {
        this.history = this.history.slice(0, index + 1);
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
      children: children.map(id => this.get(id).getLayout(params)),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  mount(params) {
    Navigation.setRoot({ root: this.getInitialLayout(params) });
  }

  push(toName, params) {
    const component = this.get(toName);
    const fromId = this.route.id;

    this.history.push(toName);

    Navigation.push(fromId, component.getLayout(params));
  }

  pop(n = 1) {
    if (this.history.length === 1) {
      throw new Error('No route to navigate back to');
    }

    if (n === 1) {
      const fromId = this.route.id;

      this.history.pop();

      Navigation.pop(fromId);
    } else {
      const index = this.history.length - 1 - n;

      if (index < 0) {
        throw new Error(`Out of range pop: ${n}`);
      }

      // popToIndex
      this.history = _take(this.history, index + 1);

      const toName = _last(this.history);
      const toId = this.componentIds.get(toName);

      this.popTo(toId);
    }
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

  navigate(toName, params) {
    const index = this.history.findIndex(name => name === toName);

    if (index === -1) {
      this.push(toName, params);
    } else if (index >= 1) {
      this.popToIndex(index);
    }
  }

  goBack() {
    this.pop();
  }
}
