export default class RouterBase {
  constructor(navigator, routes, services) {
    this.navigator = navigator;
    this.routes = Object.entries(routes);
    this.services = services;

    this.controllers = new Map();
    this.matchers = new Map();
    this.uri = null;
  }

  go(uri) {
    return this.dispatch(uri);
  }

  goBack() {
    return this.navigator.goBack();
  }

  dispatch(uri) {
    const [path, search = ''] = uri.split('?');
    const query = qs(search);

    const route = this.match(path);

    if (!route) {
      throw new Error(`No matching route: ${path}`);
    }

    // Save latest URI
    this.uri = uri;

    const [name, ctrl] = route;
    const [controller, method] = this.getController(ctrl);
    const params = this.getRouteParams(name, path);
    const args = [...params, query];

    const [componentId, props] = controller[method].apply(controller, args);

    this.navigator.render(componentId, props || {});

    return [componentId, params, query];
  }

  match(path) {
    return this.routes.find(([name]) => this.getMatcher(name).test(path));
  }

  getMatcher(name) {
    if (!this.matchers.has(name)) {
      this.matchers.set(
        name,
        new RegExp(`^${name.replace(/\{\w+\}/g, '([\\w-]+)')}$`),
      );
    }

    return this.matchers.get(name);
  }

  getController(ctrl) {
    const [name, method] = ctrl.split('.');

    if (!this.controllers.has(name)) {
      this.controllers.set(name, this.services[`${name}.controller`]);
    }

    const controller = this.controllers.get(name);

    if (!controller) {
      // TODO: This error should be part of container.services
      throw new Error(`Controller not found: \`${name}.controller\``);
    }

    if (!controller[method]) {
      throw new Error(
        `Controller method not found: \`${name}.controller:${method}\``,
      );
    }

    return [controller, method];
  }

  getRouteParams(name, path) {
    const [, ...params] = this.getMatcher(name).exec(path) || [];

    return params;
  }

  onState() {
    if (this.uri) {
      this.dispatch(this.uri);
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
