export default class RouterBase {
  constructor(root) {
    this.root = root;

    this.path = null;
    this.paths = new Map();
    this.components = null;
    this.services = {};
    this.props = {};
  }

  setServices(services) {
    this.services = services;
  }

  addGlobalProp(name, prop) {
    this.props[name] = prop;
  }

  getComponents() {
    if (!this.components) {
      this.components = new Map();

      this.root.getComponents().forEach(component => {
        this.components.set(component.id, component.Component);
      });
    }

    return this.components;
  }

  match(path) {
    for (const [componentId, Component] of this.getComponents()) {
      let params;

      if (typeof Component.match === 'function') {
        params = Component.match(path);
      } else {
        // Default match
        params = componentId === path ? [] : false;
      }

      if (params !== false) {
        return [componentId, Component, params];
      }
    }

    return [];
  }

  go(path) {
    return this.dispatch(path);
  }

  dispatch(path) {
    const [componentId, Component, params] = this.match(path);

    if (!componentId) {
      throw new Error(`No matching route: ${path}`);
    }

    // Save latest path
    this.path = path;
    this.paths.set(componentId, path);

    // Compute props
    const props = Object.assign({}, this.props);

    if (typeof Component.controller === 'function') {
      Object.assign(props, Component.controller(...params, this.services));
    }

    if (Component.passProps) {
      Object.assign(props, Component.passProps);
    }

    this.root.render(componentId, props);
  }

  onState() {
    //
  }
}
