import Events from './Events';

import History from './History';
import Route from './Route';

export default /** abstract */ class Navigator extends Route {
  constructor(config = {}) {
    super();

    this.routes = new Map();
    this.options = config.options || {};
    this.initialRouteName = null;
    this.history = new History();
    this.listeners = {};
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

  findComponentNameById(componentId) {
    for (const [componentName, component] of this.routes) {
      if (component.id === componentId) {
        return componentName;
      }
    }

    return null;
  }

  findRouteIndexByName(name) {
    let index = 0;

    for (const routeName of this.routes.keys()) {
      if (routeName === name) {
        return index;
      }

      index++;
    }

    return -1;
  }

  unmount() {}

  render(path, props) {
    throwAbstract('render(path, props)');
  }

  goBack() {
    throwAbstract('goBack()');
  }

  readPath(path) {
    const [name, ...childPath] = path.split('/');

    return [name, childPath.length ? childPath.join('/') : null];
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
