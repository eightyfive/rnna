import Route from './Route';

export default /** abstract */ class Navigator extends Route {
  constructor(routes, config) {
    super();

    this.routes = routes;
    this.order = config.order || Object.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
    this.history = [];
  }

  get routeName() {
    return this.history[this.history.length - 1];
  }

  get active() {
    return this.getRoute(this.routeName);
  }

  getRoute(name) {
    const navigator = this.routes[name];

    if (!navigator) {
      throw new Error(`Unknown navigator: ${name}`);
    }

    return navigator;
  }

  unmount(fromId) {}

  navigate(route, params, fromId) {
    throwAbstract('navigate(route, params, fromId)');
  }

  goBack(fromId) {
    throwAbstract('goBack(fromId)');
  }

  getRouteNavigator(route) {
    return this.getRouteSegments(route).shift();
  }

  getRouteNext(route) {
    const [, ...rest] = this.getRouteSegments(route);

    return rest.length ? rest.join('/') : null;
  }

  getRouteComponentId(route) {
    return this.getRouteSegments(route).pop();
  }

  getRouteSegments(route) {
    return route.split('/');
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
