export { default as Container } from './container';

export class Bundle {
  register(container) {
    throw new Error(
      `Abstract: Implement ${this.constructor.name}::register(container) method`,
    );
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

export class Controller {
  match(path, query = {}) {
    throw new Error(
      `Implement ${this.constructor.name}::match(path, query = {}) method`,
    );
  }
}

export class Listener {
  listen(type) {
    throw new Error(`Implement ${this.constructor.name}::listen(type) method`);
  }

  handle(payload) {
    throw new Error(
      `Implement ${this.constructor.name}::handle(payload) method`,
    );
  }
}
