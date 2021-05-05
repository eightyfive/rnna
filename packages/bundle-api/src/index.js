import { Bundle } from 'rnna';

import createHttp from './http';
import createReducer from './reducer';

export default class ApiBundle extends Bundle {
  register(container) {
    container.service('api', createHttp, 'api.defaults');
  }

  boot(services, store) {
    Object.assign(services.db, selectors);
  }

  getReducers() {
    return {
      api: createReducer(),
    };
  }

  getEpics() {
    return [];
  }
}
