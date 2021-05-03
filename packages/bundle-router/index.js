import { Bundle } from 'rnna';

import createRouter from './factory';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('router', createRouter, 'router.routes', 'db');
  }

  boot(services, store) {
    services.router.addGlobalProp('dispatch', store.dispatch);

    store.subscribe(() => services.router.onState());
  }
}
