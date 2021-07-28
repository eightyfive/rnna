import { Bundle } from 'rnna';

import createHttp from './http';
import createReducer from './reducer';
import * as selectors from './selectors';

export default class ApiBundle extends Bundle {
  register(container) {
    container.service('api', createHttp, 'api.defaults');
  }

  boot(services) {
    if (services.db) {
      Object.assign(services.db, selectors);
    }
  }

  getReducers() {
    return {
      api: createReducer(),
    };
  }
}
