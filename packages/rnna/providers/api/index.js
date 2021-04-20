import Provider from '../../provider';
import createReducer from './reducer';
import * as selectors from './selectors';
import createHttp from './http';

class ApiProvider extends Provider {
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

export default function createApi(config) {
  return new ApiProvider(config);
}
