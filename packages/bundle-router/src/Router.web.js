import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(root) {
    super(root);

    this.listeners = [];

    window.addEventListener('popstate', () => this.handlePopstate());
  }

  handlePopstate() {
    const { pathname } = new URL(document.location);

    const path = pathname.substring(1);

    this.dispatch(path);
  }

  dispatch(path) {
    super.dispatch(path);

    window.history.pushState({}, null, path);

    this.triggerChange(path);
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
