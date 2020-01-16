import Mountable from './Mountable';

export default /** abstract */ class Navigator extends Mountable {
  unmount(fromId) {}

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
