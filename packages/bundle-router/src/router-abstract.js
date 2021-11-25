const defaultOptions = {
  globalProps: {},
  getGlobalProps: () => ({}),
};

export default class RouterAbstract {
  constructor(navigator, routes, options) {
    this.navigator = navigator;
    this.routes = routes;
    this.options = Object.assign({}, defaultOptions, options || {});
    this.history = [];
    this.uris = new Map();
    this.uri = null;
    this.state = null;
    this.services = {};
    this.listeners = {};

    this.notFound = this.routes['_404'] || null;

    if (this.notFound) {
      delete this.routes['_404'];
    }

    this.navigator.addListener(
      'ComponentDidAppear',
      this.handleComponentDidAppear,
    );
    this.navigator.addListener(
      'ComponentDidDisappear',
      this.handleComponentDidDisappear,
    );
  }

  handleComponentDidAppear = ({ componentId }) => {
    if (!this.history.includes(componentId)) {
      this.history.push(componentId);
    }
  };

  handleComponentDidDisappear = ({ componentId }) => {
    this.history = this.history.filter(id => id !== componentId);

    const currentId = Array.from(this.history).pop();

    this.uri = this.uris.get(currentId);
  };

  setServices(services) {
    this.services = services;
  }

  setGlobalProp(name, value) {
    this.options.globalProps[name] = value;
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

  emit(eventName, ...args) {
    if (this.listeners[eventName]) {
      for (const listener of this.listeners[eventName]) {
        listener(...args);
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

    let componentId;
    let props;
    let params;

    for (const [route, controller] of Object.entries(this.routes)) {
      const re = new RegExp(`^${route}$`);
      const res = re.exec(path);

      if (res) {
        [, ...params] = res;

        const data = controller.apply(controller, [
          ...params,
          this.services,
          query,
        ]);

        if (Array.isArray(data)) {
          [componentId, props = {}] = data;
        } else {
          componentId = route;
          props = data;
        }
        break;
      }
    }

    if (!componentId && this.notFound) {
      [componentId, props = {}] = this.notFound.apply(this.notFound, [
        this.services,
      ]);
    }

    if (componentId) {
      const { globalProps, getGlobalProps } = this.options;

      props = Object.assign(
        {},
        globalProps,
        getGlobalProps(this.services),
        props,
      );

      this.navigator.render(componentId, props);

      return [componentId, path, query, params || []];
    }

    const err = new Error(`No matching controller: ${path}`);

    Object.assign(err, { name: 'RouteNotFound', path, uri });

    throw err;
  }

  dispatch(uri) {
    const [componentId, path, query, params] = this.render(uri);

    // Save latest URI
    this.uri = uri;
    this.uris.set(componentId, uri);

    this.emit('dispatch', { componentId, uri, path, query, params });
  }

  onState(state) {
    if (this.uri !== null && this.state !== state) {
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
