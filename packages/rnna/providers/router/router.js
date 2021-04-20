import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import shallowEqual from 'shallowequal';

import RootNavigator from './RootNavigator';

export default class Router extends RootNavigator {
  constructor(routes, screens, services = {}) {
    super(routes);

    this.cache = new Map();
    this.cache.set('params', new Map());
    this.screens = screens;
    this.services = services || {};
    this.props = {};

    this.state = null;
    this.componentId = null;
  }

  addGlobalProp(name, prop) {
    this.props[name] = prop;
  }

  go(componentId, params) {
    if (!this.screens.has(componentId)) {
      throw new Error(`Component "${componentId}" not found`);
    }

    this.componentId = componentId;

    const props = this.getProps(componentId, params);

    // Save latest params for `@see update`
    this.getCache('params').set(componentId, params);

    this.navigate(componentId, props);
  }

  update(state) {
    const component = this.get(this.componentId);

    if (!component) {
      throw new Error(`Component "${this.componentId || 'NULL'}" not found`);
    }

    this.state = state;

    const params = this.getCache('params').get(componentId) || [];
    const props = this.getProps(componentId, params);

    if (!shallowEqual(props, component.passProps)) {
      component.update(props);
    }
  }

  getProps(componentId, params) {
    const Screen = this.screens.get(componentId);

    const props = Object.assign({}, this.props);

    if (typeof Screen.controller === 'function') {
      Object.assign(
        props,
        Screen.controller(this.state, this.services, ...params),
      );
    }

    if (Screen.passProps) {
      Object.assign(props, Screen.passProps);
    }

    return props;
  }

  getCache(name) {
    return this.cache.get(name);
  }
}

// Traverse obj for depth
export function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of Object.entries(route)) {
    const isRoute = key !== 'config' && key !== 'options';
    const isDeep = isRoute && _isObject(val);

    if (isDeep) {
      currentDepth++;
    }

    if (isDeep) {
      depth = getRouteDepth(val, currentDepth, depth);
    } else {
      depth = Math.max(currentDepth, depth);
    }

    currentDepth = 0;
  }

  return depth;
}
