import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(layouts, config = {}) {
    super(layouts, config);

    this.listeners = [];

    window.addEventListener('popstate', () => this.handlePopstate());
  }

  getPath() {
    const { pathname } = new URL(document.location);

    return pathname.substring(1);
  }

  handlePopstate() {
    const path = this.getPath();

    this.dispatch(path);
  }

  dispatch(path) {
    super.dispatch(path);

    if (path !== this.getPath()) {
      window.history.pushState({}, null, path);

      this.triggerChange(path);
    }
  }

  triggerChange(path) {
    this.listeners.map(listener => listener(path));
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    };
  }
}
