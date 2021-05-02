import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import {
  createBottomTabsNavigator,
  createOverlayNavigator,
  createStackNavigator,
} from '@rnna/navigator';

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
  return _mapValues(routes, (route, id) => {
    const isOverlay = !_isObject(route);

    if (isOverlay) {
      return createOverlayNavigator(id, route);
    }

    const { options = {}, config = {}, ...nestedRoutes } = route;
    const depth = getRouteDepth(route);

    config.parentId = id;

    if (depth === 1) {
      return createBottomTabsNavigator(nestedRoutes, options, config);
    }

    if (depth === 0) {
      return createStackNavigator(nestedRoutes, options, config);
    }

    throw new Error('Invalid routes obj');
  });
}

export default function createRouter(routes, db) {
  const components = findComponents(routes, new Map());

  return new Router(createRoutes(routes), components, { db });
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
