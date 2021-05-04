import { Bundle } from 'rnna';

import createRouter from './factory';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('router', createRouter, 'router.routes');
  }

  boot(services, store) {
    services.router.addGlobalProp('dispatch', store.dispatch);
    services.router.setServices(services);

    store.subscribe(() => services.router.onState());
  }
}
