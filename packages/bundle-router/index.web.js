import Bundle from 'rnna/bundle';

import Router from './Router';

class RouterBundle extends Bundle {
  constructor(routes) {
    super();

    this.routes = routes;
    this.router = null;
  }

  register(services, reducers, epics) {
    this.router = new Router(this.routes, services);

    Object.assign(services, { router: this.router });
  }

  boot(store) {
    this.router.addGlobalProp('dispatch', store.dispatch);
  }
}

export default function bundleRouter(routes) {
  return new RouterBundle(routes);
}
