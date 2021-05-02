export { default as Container } from 'bottlejs';

export class ServiceProvider {
  register(container) {
    throw new Error(`Abstract: Implement ServiceProvider register method`);
  }

  boot(services, store) {}
}

export class Bundle {
  getServiceProvider() {
    throw new Error(`Abstract: Implement Bundle getServiceProvider method`);
    // return @see ServiceProvider;
  }

  getReducers() {
    throw new Error(`Abstract: Implement Bundle getReducers method`);
    // return {};
  }

  getEpics() {
    throw new Error(`Abstract: Implement Bundle getEpics method`);
    // return [];
  }
}
