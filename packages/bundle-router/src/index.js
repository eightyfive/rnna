import { Bundle } from 'rnna';

import Router from './Router';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service(
      'router',
      Router,
      'navigator',
      'router.routes',
      'router.options',
    );
  }

  boot(services, store) {
    services.router.setServices(services);

    store.subscribe(() => services.router.onState(store.getState()));
  }
}
