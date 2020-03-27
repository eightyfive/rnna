import _last from 'lodash.last';
import Route from './Route';

export default /** abstract */ class Navigator extends Route {
  constructor(routes, config) {
    super();

    this.routes = routes;
    this.order = config.order || Object.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
    this.history = [this.initialRouteName];

    this.parent = null;
    this.name = null;

    Object.keys(this.routes).forEach(name => {
      const route = this.routes[name];

      route.parent = this;
      route.name = name;
    });
  }

  get route() {
    const name = _last(this.history);

    return this.get(name);
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
    throwAbstract('go(path, params, fromId)');
  }

  goBack(fromId) {
    throwAbstract('goBack(fromId)');
  }

  getPathNavigator(path) {
    return this.getPathSegments(path).shift();
  }

  getNextPath(path) {
    const [, ...rest] = this.getPathSegments(path);

    return rest.length ? rest.join('/') : null;
  }

  getPathComponentId(path) {
    return this.getPathSegments(path).pop();
  }

  getPathSegments(path) {
    return path.split('/');
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
