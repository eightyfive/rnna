import Mountable from './Mountable';

export default /** abstract */ class Navigator extends Mountable {
  constructor(routes, config) {
    super();

    this.routes = routes;
    this.order = config.order || Object.keys(routes);
    this.initialRouteName = config.initialRouteName || this.order[0];
  }

  getNavigator(key) {
    const navigator = this.routes[key];

    if (!navigator) {
      throw new Error(`Unknown navigator: ${key}`);
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
