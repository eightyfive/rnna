export { default as Container } from 'bottlejs';

export class Bundle {
  register(container) {
    throw new Error(`Abstract: Implement Bundle::register method`);
  }

  boot(services, store) {
    //
  }

  getReducers() {
    return {};
  }

  getEpics() {
    return [];
  }
}
