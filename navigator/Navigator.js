import _forEach from 'lodash.foreach';
import _last from 'lodash.last';
import Component from './Component';
import Route from './Route';

function createId(parentId, id) {
  return parentId ? `${parentId}/${id}` : id;
}

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
    this.id = null;

    _forEach(this.routes, (route, id) => {
      route.parent = this;
      route.id = createId(config.parentId, id);
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
    const id = _last(this.history);

    if (id) {
      return this.get(id);
    }

    return null;
  }

  get(id) {
    const route = this.routes[id];

    if (!route) {
      throw new Error(`Unknown route: ${id}`);
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
    const [id, ...rest] = path.split('/');

    return [id, rest.length ? rest.join('/') : null];
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
