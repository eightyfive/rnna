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
    const [pathname, search = ''] = uri.split('?');

    const path = pathname.substring(1);
    const query = qs(search);

    const route = this.match(path);

    if (!route) {
      throw new Error(`No matching route: ${path}`);
    }

    // Save latest URI
    this.uri = uri;

    const [name, ctrl] = route;
    const controller = this.getController(ctrl);
    const args = this.getRouteParams(name, path);

    args.push(query);

    const [componentId, props] = controller.apply(controller, args);

    this.navigator.render(componentId, props);

    return componentId;
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

    return controller[method];
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
  return new Map(
    search
      .split('&')
      .filter(Boolean)
      .map(param => {
        const [name, value] = param.split('=');

        return [name, value || true];
      }),
  );
}
