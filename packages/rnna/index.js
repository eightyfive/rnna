export { default as Container } from './container';

export class Bundle {
  constructor(options) {
    this.options = options || {};
  }

  register(container) {
    //
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
