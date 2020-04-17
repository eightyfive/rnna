import _last from 'lodash.last';
import { Navigation } from 'react-native-navigation';

import Route from './Route';

const o = {
  entries: Object.entries,
  keys: Object.keys,
};

function createId(parentId, id) {
  return parentId ? `${parentId}/${id}` : id;
}

export default /** abstract */ class Navigator extends Route {
  constructor(routes, options, config) {
    super();

    this.routes = new Map(o.entries(routes));
    this.options = options;

    this.order = o.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
    this.history = [];
    this.listeners = {};
    this.subscriptions = {};

    this.parent = null;
    this.id = null;

    for (const [id, route] of this.routes) {
      route.parent = this;
      route.id = createId(config.parentId, id);
    }
  }

  addListener(event, listener) {
    if (!this.listeners[event]) {
      throw new Error(`Event "${event}" does not exist`);
    }

    this.listeners[event].push(listener);
  }

  removeListener(event, listener) {
    if (!this.listeners[event]) {
      throw new Error(`Event "${event}" does not exist`);
    }

    this.listeners[event] = this.listeners[event].filter(
      callback => callback !== listener,
    );
  }

  listen(wix, event) {
    const events = Navigation.events();

    this.subscriptions[event] = events[`register${wix}Listener`]((...args) =>
      this.trigger(event, args),
    );
  }

  listenOnce(wix, listener) {
    const events = Navigation.events();

    const subscription = events[`register${wix}Listener`]((...args) => {
      subscription.remove();
      listener(...args);
    });
  }

  trigger(event, args) {
    this.listeners[event].map(listener => listener(...args));
  }

  get route() {
    const id = _last(this.history);

    if (id) {
      return this.get(id);
    }

    return null;
  }

  get(id) {
    if (!this.routes.has(id)) {
      throw new Error(`Unknown route: ${id}`);
    }

    return this.routes.get(id);
  }

  unmount(fromId) {}

  go(path, params, fromId) {
    return this.navigate(path, params, fromId);
  }

  navigate(path, params, fromId) {
    throwAbstract('navigate(path, params, fromId)');
  }

  goBack(fromId) {
    throwAbstract('goBack(fromId)');
  }

  getComponent() {
    throwAbstract('getComponent');
  }

  parsePath(path) {
    const [id, ...rest] = path.split('/');

    return [id, rest.length ? rest.join('/') : null];
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
