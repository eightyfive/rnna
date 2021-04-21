import Bundle from '../../bundle';
import createReducer from './reducer';
import * as selectors from './db';
import createHttp from './http';

class ApiBundle extends Bundle {
  constructor(config) {
    super();

    this.http = createHttp(config);
  }

  register(services, reducers, epics) {
    Object.assign(services, { api: this.http });

    Object.assign(reducers, { api: createReducer() });

    Object.assign(services.db, selectors);
  }
}

export default function bundleApi(config) {
  return new ApiBundle(config);
}
