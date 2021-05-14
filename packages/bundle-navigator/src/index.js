import { Bundle } from 'rnna';

import createNavigator from './navigator';

export default class RouterProvider extends Bundle {
  register(container) {
    container.service('navigator', createNavigator, 'navigator.screens');
  }

  boot(services, store) {
    services.navigator.addGlobalProp('dispatch', store.dispatch);
  }
}
