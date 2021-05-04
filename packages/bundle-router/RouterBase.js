import _isObject from 'lodash.isplainobject';

import RouterNavigator from './RouterNavigator';

export default class RouterBase extends RouterNavigator {
  constructor(routes, components) {
    super(routes);

    this.path = null;
    this.paths = new Map();
    this.components = components;
    this.services = {};
    this.props = {};
  }

  setServices(services) {
    this.services = services;
  }

  addGlobalProp(name, prop) {
    this.props[name] = prop;
  }

  match(path) {
    let componentId, Component, params;

    for ([componentId, Component] of this.components) {
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

    this.render(componentId, props);
  }

  onState() {
    //
  }
}
