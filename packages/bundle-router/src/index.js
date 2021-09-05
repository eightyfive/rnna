import { Bundle } from 'rnna';

import createNavigator from './navigator';
import Router from './router';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('router', createRouter, 'router.*');
  }

  boot({ router, ...services }, store) {
    router.setServices(services);
    router.setGlobalProp('dispatch', store.dispatch);

    store.subscribe(() => router.onState(store.getState()));
  }
}

function createRouter(navigator, { options, routes, screens }) {
  const navigator = createNavigator(screens);

  const router = new Router(navigator, routes, options);

  return router;
}
