import { Bundle } from 'rnna';

import Router from './Router';

export default class RouterProvider extends Bundle {
  register(container) {
    container.factory('router', services => {
      return new Router(
        services.navigator,
        services['router.routes'],
        services,
      );
    });
  }

  boot(services, store) {
    store.subscribe(() => services.router.onState());
  }
}
