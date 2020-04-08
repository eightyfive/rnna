import _isEmpty from 'lodash.isempty';
import _isPlainObject from 'lodash.isplainobject';

import Component from './Component';
import Route from './Route';

export function createRoutes(routeConfigs, optionsSelector) {
  const routes = {};

  for (const [id, routeConfig] of Object.entries(routeConfigs)) {
    if (routeConfig instanceof Route) {
      routes[id] = routeConfig;
    } else {
      if (_isEmpty(routeConfig)) {
        routes[id] = createComponent(id);
      } else {
        routes[id] = createComponent(
          id,
          optionsSelector ? optionsSelector(routeConfig) : routeConfig,
        );
      }
    }
  }

  return routes;
}

export function createComponent(id, options) {
  return new Component(id, { options });
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
  for (const [key, val] of Object.entries(route)) {
    const isObject = _isPlainObject(val) && !rnnNames[key] && !rnNames[key];
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
