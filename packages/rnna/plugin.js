export default class Plugin {
  register(services, reducers, epics) {
    throw new Error(
      `Abstract: Implement ${this.constructor.name} register method`,
    );
  }
}
