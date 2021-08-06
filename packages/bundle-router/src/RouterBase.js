export default class RouterBase {
  constructor(navigator, routes) {
    this.navigator = navigator;
    this.routes = routes;
    this.uri = null;
    this.state = null;
    this.services = {};
    this.listeners = {};
  }

  setServices(services) {
    this.services = services;
  }

  addListener(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(listener);
  }

  removeListener(eventName, listener) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        handler => handler !== listener,
      );
    }
  }

  fire(eventName, data) {
    if (this.listeners[eventName]) {
      for (const listener of this.listeners[eventName]) {
        listener(data);
      }
    }
  }

  go(uri) {
    return this.dispatch(uri);
  }

  goBack() {
    return this.navigator.goBack();
  }

  render(uri) {
    const [path, search = ''] = uri.split('?');
    const query = qs(search);

    for (const [route, controller] of Object.entries(this.routes)) {
      if (route === uri) {
        const [componentId, props = {}] = controller(this.services, query);

        this.navigator.render(componentId, props);

        return [componentId, props];
      }
    }

    throw new Error(`No matching controller: ${path}`);
  }

  dispatch(uri) {
    const [componentId, props] = this.render(uri);

    // Save latest URI
    this.uri = uri;

    this.fire('dispatch', { componentId, props });
  }

  onState(state) {
    if (this.uri && this.state !== state) {
      this.state = state;

      this.render(this.uri);
    }
  }
}

function qs(search) {
  const query = {};

  search
    .split('&')
    .filter(Boolean)
    .forEach(param => {
      const [name, value] = param.split('=');

      query[name] = value;
    });

  return query;
}
