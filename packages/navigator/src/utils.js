import _isObject from 'lodash.isplainobject';

import Component from './Component';

export function createComponent(id, name, ReactComponent) {
  return Component.register(
    id,
    name,
    ReactComponent,
    ReactComponent.options || {},
  );
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
