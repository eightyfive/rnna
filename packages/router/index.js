import _isObject from 'lodash.isplainobject';
import shallowEqual from 'shallowequal';
import { createRootNavigator } from '@rnna/navigator';

const o = Object;

export default class Router {
  constructor(routes, services = {}) {
    this.cache = new Map();
    this.cache.set('params', new Map());
    this.navigator = createRootNavigator(routes);
    this.prevState = {};
    this.screens = new Map();
    this.services = services;
    this.injections = {};

    this.findScreens(routes);
  }

  inject(name, service) {
    this.injections[name] = service;
  }

  boot() {
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

    let props;

    if (typeof Screen.controller === 'function') {
      props = Screen.controller(state, this.services, ...params);
    } else {
      props = Screen.passProps ? { ...Screen.passProps } : {};
    }

    o.assign(props, this.injections);

    return props;
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
