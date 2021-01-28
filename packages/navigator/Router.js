import shallowEqual from 'shallowequal';

import RootNavigator from './RootNavigator';

const o = Object;

export default class Router extends RootNavigator {
  constructor(routes, screens, services = {}) {
    super(routes);

    this.cache = new Map();
    this.cache.set('params', new Map());
    this.prevState = {};
    this.screens = screens;
    this.services = services || {};
  }

  go(componentId, state, params = []) {
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

    let props = {};

    if (typeof Screen.controller === 'function') {
      props = Screen.controller(state, this.services, ...params);
    }

    if (Screen.passProps) {
      o.assign(props, Screen.passProps);
    }

    return props;
  }

  getCache(name) {
    return this.cache.get(name);
  }
}
