export default class Router {
  constructor(routes, services = {}) {
    this.routes = routes;
    this.services = services;
    this.props = {};
    this.listeners = [];

    window.addEventListener('popstate', ev => this.handlePopstate(ev));
  }

  handlePopstate(ev) {
    const { pathname } = new URL(document.location);

    const path = pathname.substring(1);

    this.triggerChange(path, (ev.state || {}).params || []);
  }

  addGlobalProp(name, prop) {
    this.props[name] = prop;
  }

  go(path, ...params) {
    window.history.pushState({ params }, null, path);

    this.triggerChange(path, params);
  }

  triggerChange(path, params) {
    this.listeners.map(listener => listener(path, params));
  }

  render(path) {
    const Screen = this.routes[path] || null;

    if (Screen) {
      const props = Object.assign(
        {},
        this.props,
        Screen.controller(this.services),
      );

      return [Screen, props];
    }

    return [];
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    };
  }
}
