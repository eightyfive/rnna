import { Bundle } from 'rnna';

import Router from './router';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('router', createRouter, 'navigator', 'router.*');
  }

  boot(services, store) {
    services.router.setServices(services);

    store.subscribe(() => services.router.onState(store.getState()));
  }
}

function createRouter(navigator, { routes, options }) {
  return new Router(navigator, routes, options);
}
