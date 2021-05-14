import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(navigator, routes, services) {
    super(navigator, routes, services);

    this.listeners = [];

    window.addEventListener('popstate', () => this.handlePopstate());
  }

  getURI() {
    const { pathname, search = '' } = new URL(document.location);

    return pathname + search;
  }

  handlePopstate() {
    const uri = this.getURI();

    this.dispatch(uri);
  }

  dispatch(uri) {
    super.dispatch(uri);

    if (uri !== this.getURI()) {
      window.history.pushState({}, null, uri);

      this.triggerChange(uri);
    }
  }

  triggerChange(uri) {
    this.listeners.map(listener => listener(uri));
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    };
  }
}
