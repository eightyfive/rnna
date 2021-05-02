import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import {
  createBottomTabsNavigator,
  createOverlayNavigator,
  createStackNavigator,
} from '@rnna/navigator';

import Router, { getRouteDepth } from './Router';

function findScreens(routes, screens, parentId = null) {
  for (const [key, route] of Object.entries(routes)) {
    if (key === 'options' || key === 'config') {
      continue;
    }

    const id = parentId ? `${parentId}/${key}` : key;

    if (_isObject(route)) {
      findScreens(route, screens, id);
    } else {
      screens.set(id, route);
    }
  }

  return screens;
}

function createRoutes(routes) {
  return _mapValues(routes, (route, id) => {
    const isOverlay = !_isObject(route);

    if (isOverlay) {
      return createOverlayNavigator(id, route);
    }

    const { options = {}, config = {}, ...screens } = route;
    const depth = getRouteDepth(route);

    config.parentId = id;

    if (depth === 1) {
      return createBottomTabsNavigator(screens, options, config);
    }

    if (depth === 0) {
      return createStackNavigator(screens, options, config);
    }

    throw new Error('Invalid routes obj');
  });
}

export default function createRouter(routes, db) {
  const screens = findScreens(routes, new Map());

  return new Router(createRoutes(routes), screens, { db });
}
