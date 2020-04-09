import _last from 'lodash.last';
import Route from './Route';

export default /** abstract */ class Navigator extends Route {
  constructor(routes, config) {
    super();

    this.routes = routes;
    this.order = Object.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
    this.history = [];
    this.listeners = {};
    this.subscriptions = {};

    this.parent = null;
    this.name = null;

    Object.keys(this.routes).forEach(name => {
      const route = this.routes[name];

      route.parent = this;
      route.name = name;
    });
  }

  addListener(name, listener) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(listener);
  }

  trigger(name, ev) {
    if (this.listeners[name]) {
      this.listeners[name].map(listener => listener(ev));
    }
  }

  get route() {
    const name = _last(this.history);

    if (name) {
      return this.get(name);
    }

    return null;
  }

  get(name) {
    const route = this.routes[name];

    if (!route) {
      throw new Error(`Unknown route: ${name}`);
    }

    return route;
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
    const [name, ...rest] = path.split('/');

    return [name, rest.length ? rest.join('/') : null];
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
