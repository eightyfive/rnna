export default class Provider {
  register(services, reducers, epics) {
    throw new Error(`Abstract: Implement service provider register method`);
  }
}
