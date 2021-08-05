export default class RouterBase {
  constructor(navigator, routes) {
    this.navigator = navigator;
    this.routes = routes;
    this.uri = null;
    this.state = null;
    this.services = {};
  }

  setServices(services) {
    this.services = services;
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

    for (const [route, controller] of Object.entries(this.routes)) {
      if (route === uri) {
        const [componentId, props = {}] = controller(this.services, query);

        // Save latest URI
        this.uri = uri;

        this.navigator.render(componentId, props);

        return [componentId, props];
      }
    }

    throw new Error(`No matching controller: ${path}`);
  }

  onState(state) {
    if (this.uri && this.state !== state) {
      this.state = state;

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
