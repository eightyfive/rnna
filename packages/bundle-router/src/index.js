import { Bundle } from 'rnna';
import { createNavigatorsFromRoutes } from '@rnna/navigator';

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

function createRouter({ options, routes }) {
  const navigators = createNavigatorsFromRoutes(routes);

  return new Router(navigators, options);
}
