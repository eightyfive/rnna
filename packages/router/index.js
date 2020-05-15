import _isObject from 'lodash.isplainobject';
import shallowEqual from 'shallowequal';
import { createRootNavigator } from '@rnna/navigator';

const o = {
  entries: Object.entries,
};

export default class Router {
  constructor() {
    this.navigator = null;
    this.screens = new Map();

    this.prevState = {};
    this.cache = new Map();
    this.cache.set('params', new Map());
    this.services = {};
  }

  inject(name, service) {
    this.services[name] = service;
  }

  boot(routes) {
    this.navigator = createRootNavigator(routes);

    this.findScreens(routes);

    return this.navigator.launch();
  }

  findScreens(routes, parentId = null) {
    for (const [key, route] of o.entries(routes)) {
      if (key === 'options' || key === 'config') {
        continue;
      }

      const id = parentId ? `${parentId}/${key}` : key;

      if (_isObject(route)) {
        this.findScreens(route, id);
      } else {
        this.screens.set(id, route);
      }
    }
  }

  get(id) {
    return this.navigator.get(id);
  }

  goBack() {
    return this.navigator.goBack();
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
    const Screen = this.screens.get(component.id);

    if (!Screen.controller) {
      throw new Error(`Controller does not exist (${component.id})`);
    }

    return Screen.controller(state, this.services, ...params);
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
