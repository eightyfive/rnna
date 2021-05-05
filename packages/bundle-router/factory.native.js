import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import { createBottomTabs, createOverlay, createStack } from '@rnna/navigator';

import Router from './Router';

function findComponents(routes, components, parentId = null) {
  for (const [key, route] of Object.entries(routes)) {
    if (key === 'options' || key === 'config') {
      continue;
    }

    const id = parentId ? `${parentId}/${key}` : key;

    if (_isObject(route)) {
      findComponents(route, components, id);
    } else {
      components.set(id, route);
    }
  }

  return components;
}

function createRoutes(routes) {
  return _mapValues(routes, (route, name) => {
    const isOverlay = !_isObject(route);

    if (isOverlay) {
      return createOverlay(name, route);
    }

    const { options = {}, config = {}, ...nestedRoutes } = route;
    const depth = getRouteDepth(route);

    config.parentId = name;

    if (depth === 1) {
      return createBottomTabs(nestedRoutes, options, config);
    }

    if (depth === 0) {
      return createStack(nestedRoutes, options, config);
    }

    throw new Error('Invalid routes obj');
  });
}

export default function createRouter(routes) {
  const components = findComponents(routes, new Map());

  return new Router(createRoutes(routes), components);
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
