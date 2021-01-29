import _last from 'lodash.last';
import { Navigation } from 'react-native-navigation';

import Route from './Route';

const o = Object;

export default /** abstract */ class Navigator extends Route {
  constructor(routes, options, config) {
    super();

    this.routes = new Map(o.entries(routes));
    this.options = options;

    this.order = o.keys(routes);
    this.history = [];
    this.listeners = {};

    this.parent = null;
    this.id = null;

    const { initialRouteName, parentId } = config;

    this.initialRouteName = initialRouteName || this.order[0];

    for (const [id, route] of this.routes) {
      route.parent = this;
      route.id = parentId ? `${parentId}/${id}` : id;
    }
  }

  addListener(eventName, listener) {
    const events = Navigation.events();
    const subscription = events[`register${eventName}Listener`](listener);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(subscription);

    return subscription;
  }

  removeListener(eventName, listener) {
    const subscription = this.listeners[eventName].find(cb => cb === listener);

    if (subscription) {
      subscription.remove();

      this.listeners[eventName] = this.listeners[eventName].filter(
        cb => cb !== listener,
      );
    }
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

  unmount() {}

  navigate(path, params) {
    throwAbstract('navigate(path, params)');
  }

  goBack() {
    throwAbstract('goBack()');
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
