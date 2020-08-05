import _isObject from 'lodash.isplainobject';
import shallowEqual from 'shallowequal';

import RootNavigator from './RootNavigator';

const o = Object;

export default class Router extends RootNavigator {
  constructor(routes, services = {}) {
    super(routes);

    this.cache = new Map();
    this.cache.set('params', new Map());
    this.prevState = {};
    this.screens = new Map();
    this.services = services;

    this.findScreens(routes);
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

  dispatch(componentId, state, params = []) {
    const component = this.get(componentId);

    if (!component) {
      throw new Error(`Component "${componentId}" not found`);
    }

    const props = this.getProps(component, state, params);

    this.navigate(component.id, props);

    // Save params for render
    this.getCache('params').set(component.id, params);
  }

  render(component, state) {
    const params = this.getCache('params').get(component.id) || [];
    const props = this.getProps(component, state, params);

    if (!shallowEqual(props, component.passProps)) {
      component.update(props);
    }
  }

  rerender(state) {
    const changed = this.prevState !== state;

    if (changed) {
      const component = this.getComponent();

      if (component) {
        this.render(component, state);
      }

      this.prevState = state;
    }
  }

  getProps(component, state, params) {
    const Screen = this.screens.get(component.id);

    if (typeof Screen.passProps === 'function') {
      return Screen.passProps(state, this.services, ...params);
    }

    return Screen.passProps ? { ...Screen.passProps } : {};
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
