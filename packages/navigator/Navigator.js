import Events from './Events';

import History from './History';
import Route from './Route';

export default /** abstract */ class Navigator extends Route {
  constructor(config) {
    super();

    this.routes = new Map();
    this.options = config.options || {};
    this.initialRouteName = null;
    this.history = new History();

    this.listeners = {};

    this.parent = null;
    this.id = null;

    const { parentId } = config;

    for (const [id, route] of this.routes) {
      route.parent = this;
      route.id = parentId ? `${parentId}/${id}` : id;
    }
  }

  addRoute(name, route) {
    if (!this.routes.size) {
      this.initialRouteName = name;
    }

    this.routes.set(name, route);
  }

  addListener(eventName, listener) {
    const subscription = Events.addListener(eventName, listener);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(subscription);

    return subscription;
  }

  removeListener(eventName, listener) {
    const subscription = this.listeners[eventName].find(cb => cb === listener);

    if (subscription) {
      Events.removeListener(subscription);

      this.listeners[eventName] = this.listeners[eventName].filter(
        cb => cb !== listener,
      );
    }
  }

  getRoute(name) {
    if (!this.routes.has(name)) {
      throw new Error(`Route not found: ${name}`);
    }

    return this.routes.get(name);
  }

  getCurrentRoute() {
    return this.getRoute(this.history.current);
  }

  findRouteNameById(id) {
    for (const [name, route] of this.routes) {
      if (route.id === id) {
        return name;
      }
    }

    throw new Error(`Route not found: ${id}`);
  }

  findRouteIndexByName(name) {
    let index = 0;

    for (const routeName of this.routes.keys()) {
      if (routeName === name) {
        return index;
      }

      index++;
    }

    throw new Error(`Route not found: ${name}`);
  }

  unmount() {}

  render(path, props) {
    throwAbstract('render(path, props)');
  }

  goBack() {
    throwAbstract('goBack()');
  }

  parsePath(path) {
    const [id, ...rest] = path.split('/');

    return [id, rest.length ? rest.join('/') : null];
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
