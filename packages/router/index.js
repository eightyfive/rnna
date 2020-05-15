import _isObject from 'lodash.isplainobject';
import shallowEqual from 'shallowequal';
import { createRootNavigator } from '@rnna/navigator';

const o = {
  entries: Object.entries,
};

function createControllers(routes) {
  const controllers = new Map();
  const screens = findScreens(routes);

  for (const [id, Screen] of o.entries(screens)) {
    controllers.set(id, Screen.controller);
  }

  return controllers;
}

function findScreens(routes, screens = {}, parentId = null) {
  for (const [key, val] of o.entries(routes)) {
    if (key === 'options' || key === 'config') {
      continue;
    }

    const id = parentId ? `${parentId}/${key}` : key;

    if (_isObject(val)) {
      screens = findScreens(val, screens, id);
    } else {
      screens[id] = val;
    }
  }

  return screens;
}

export default class Router {
  constructor() {
    this.navigator = null;

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
    this.navigator = createRootNavigator(routes);
    this.controllers = createControllers(routes);
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

    if (!controller) {
      throw new Error(`Controller does not exist (${component.id})`);
    }

    return controller(state, this.services, ...params);
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
