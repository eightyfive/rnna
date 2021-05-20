export default class RouterBase {
  constructor(navigator, controllers) {
    this.navigator = navigator;
    this.controllers = Object.values(controllers);
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

    for (const controller of this.controllers) {
      const [componentId, props = {}] = controller.match(path, query) || [];

      if (componentId) {
        // Save latest URI
        this.uri = uri;

        this.navigator.render(componentId, props);

        return [componentId, props];
      }
    }

    throw new Error(`No matching controller: ${path}`);
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
