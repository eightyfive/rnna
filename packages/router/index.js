import shallowEqual from 'shallowequal';

const o = {
  entries: Object.entries,
};

export default class Router {
  constructor(navigator) {
    this.navigator = navigator;

    this.prevState = {};
    this.controllers = new Map();
    this.cache = new Map();
    this.cache.set('params', new Map());
    this.services = {};
  }

  inject(name, service) {
    this.services[name] = service;
  }

  setRoutes(routes) {
    if (routes instanceof Map) {
      this.controllers = routes;
    } else {
      this.controllers = new Map(o.entries(routes));
    }
  }

  addRoute(componentId, controller) {
    this.controllers.set(componentId, controller);
  }

  dispatch(componentId, state, params = []) {
    const component = this.navigator.get(componentId);

    if (!component) {
      throw new Error(`Component "${componentId}" not found`);
    }

    const props = this.getProps(component, state, params);

    this.navigator.navigate(component.id, props);

    // Save params for render
    this.getCache('params').set(component.id, params);
  }

  onState(state) {
    const changed = this.prevState !== state;

    if (changed) {
      const component = this.navigator.getComponent();

      if (component) {
        this.render(component, state);
      }

      this.prevState = state;
    }
  }

  render(component, state) {
    const params = this.getCache('params').get(component.id) || [];
    const props = this.getProps(component, state, params);

    if (!shallowEqual(props, component.passProps)) {
      component.update(props);
    }
  }

  getProps(component, state, params) {
    const controller = this.controllers.get(component.id);

    return controller(state, this.services, ...params);
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
