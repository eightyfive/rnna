import Bundle from 'rnna/bundle';

import createRouter from './factory';

class RouterBundle extends Bundle {
  constructor(routes) {
    super();

    this.routes = routes;
    this.router = null;
  }

  register(services, reducers, epics) {
    this.router = createRouter(this.routes, services);

    Object.assign(services, { router: this.router });
  }

  boot(store) {
    this.router.addGlobalProp('dispatch', store.dispatch);

    store.subscribe(() => this.router.onState());
  }
}

export default function bundleRouter(routes) {
  return new RouterBundle(routes);
}
