import { Navigation } from 'react-native-navigation';
import React from 'react';
import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';

import Component from './Component';

const o = {
  assign: Object.assign,
  entries: Object.entries,
};

export function createComponents(screens) {
  return _mapValues(screens, (Screen, id) => createComponent(id, Screen));
}

export function createComponent(id, Screen) {
  registerComponent(id, Screen);

  return new Component(id, Screen.options || {});
}

// Traverse obj for depth
export function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of o.entries(route)) {
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

export function registerComponent(name, Screen, Provider = null, store = null) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => props => (
        <Provider {...{ store }}>
          <Screen {...props} />
        </Provider>
      ),
      () => Screen,
    );
  } else {
    Navigation.registerComponent(name, () => Screen);
  }
}
