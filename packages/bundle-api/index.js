import { Bundle } from 'rnna';

import createReducer from './reducer';
import ApiProvider from './provider';

export default class ApiBundle extends Bundle {
  getServiceProvider() {
    return new ApiProvider();
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
