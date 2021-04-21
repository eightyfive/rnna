export default class Bundle {
  register(services, reducers, epics) {
    throw new Error(`Abstract: Implement Bundle register method`);
  }

  boot(store) {}
}
