export default class Plugin {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  register() {}

  getReducer() {}

  getEpics() {
    return [];
  }
}
