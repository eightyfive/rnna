import _isEmpty from 'lodash.isempty';
import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';

import Component from './Component';
import Route from './Route';

const o = {
  entries: Object.entries,
};

export function createRoutes(routes) {
  return _mapValues(routes, (route, id) => {
    if (_isObject(route)) {
      return createComponent(id, route);
    }

    return route;
  });
}

export function createComponent(id, options) {
  return new Component(id, options);
}

// https://wix.github.io/react-native-navigation/#/docs/styling?id=options-object-format
const rnnNames = {
  statusBar: true,
  layout: true,
  modalPresentationStyle: true,
  topBar: true,
  bottomTabs: true,
  bottomTab: true,
  sideMenu: true,
  overlay: true,
  modal: true,
  preview: true,
};

const rnNames = {
  headerStyle: true,
  headerTitleStyle: true,
  headerBackTitleStyle: true,
  tabBarOptions: true,
};

// Traverse obj for depth
export function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of o.entries(route)) {
    const isObject = _isObject(val) && !rnnNames[key] && !rnNames[key];
    const isEmpty = _isEmpty(val);

    if (isObject) {
      currentDepth++;
    }

    if (isObject && !isEmpty) {
      depth = getRouteDepth(val, currentDepth, depth);
    } else {
      depth = Math.max(currentDepth, depth);
    }

    currentDepth = 0;
  }

  return depth;
}