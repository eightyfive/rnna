import { Bundle } from 'rnna';

import Router from './Router';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('router', Router, 'navigator', 'controllers.*');
  }

  boot(services, store) {
    store.subscribe(() => services.router.onState(store.getState()));
  }
}
