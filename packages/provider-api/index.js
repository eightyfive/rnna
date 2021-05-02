import { ServiceProvider } from 'rnna';

import createHttp from './http';

export default class ApiProvider extends ServiceProvider {
  register(container) {
    container.service('api', createHttp, 'api.defaults');
  }
}
