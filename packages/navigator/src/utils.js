import _isObject from 'lodash.isplainobject';

import { Component } from './Layouts';
import Registry from './Registry';

export function createComponent(id, name, ReactComponent) {
  Registry.register(id, name, ReactComponent);

  return new Component(id, name, ReactComponent.options || {});
}

export function createComponents(routes, parentId) {
  const components = {};

  Object.entries(routes).forEach(([componentName, ReactComponent]) => {
    const componentId = parentId
      ? `${parentId}/${componentName}`
      : componentName;

    const component = createComponent(
      componentId,
      componentName,
      ReactComponent,
    );

    components[componentName] = component;
  });

  return components;
}

export function resolveLayouts(routes) {
  const bottomTabs = new Map();
  const modals = new Map();
  const overlays = new Map();
  const stacks = new Map();

  Object.entries(routes).forEach(([name, route]) => {
    const type = getRouteType(route);

    if (type === 'overlay') {
      overlays.set(name, [name, name, route]);
    } else {
      const { config: layoutConfig = {}, ...nestedRoutes } = route;

      layoutConfig.parentId = name;

      if (type === 'bottomTabs') {
        bottomTabs.set(name, [nestedRoutes, layoutConfig]);
      } else if (type === 'stack') {
        stacks.set(name, [nestedRoutes, layoutConfig]);
      } else if (type === 'modal') {
        modals.set(name, [nestedRoutes, layoutConfig]);
      } else {
        throw new Error(
          `Invalid route (too deep): ${JSON.stringify(route, null, 2)}`,
        );
      }
    }
  });

  return [bottomTabs, modals, overlays, stacks];
}

// Traverse obj for depth
export function getRouteType(route) {
  const depth = getObjDepth(route, 0, ['config']);

  if (depth === 0) {
    return 'overlay';
  }

  if (depth === 1) {
    const { mode } = route.config || {};

    return mode === 'modal' ? 'modal' : 'stack';
  }

  if (depth === 2) {
    return 'bottomTabs';
  }

  return null;
}

export function getObjDepth(obj, depth = 0, blacklist = []) {
  let isObj = _isObject(obj);

  if (isObj) {
    depth++;

    const levelDepth = depth;
    let maxDepth = depth;

    for (const [key, nested] of Object.entries(obj)) {
      isObj = _isObject(nested);

      if (isObj && !blacklist.includes(key)) {
        depth = getObjDepth(nested, depth, blacklist);
      }

      maxDepth = Math.max(maxDepth, depth);
      depth = levelDepth;
    }

    depth = maxDepth;
  }

  return depth;
}
