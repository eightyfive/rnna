import ServiceProvider from '@rnna/provider-api';
import * as selectors from './selectors';

export default class ApiProvider extends ServiceProvider {
  boot(services, store) {
    Object.assign(services.db, selectors);
  }
}
