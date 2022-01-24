import React from 'react';
import { Navigation } from 'react-native-navigation';
import _isObject from 'lodash.isplainobject';

import { Component } from './Layouts';

export function registerScreen(name, ScreenComponent, Provider) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => props => (
        <Provider>
          <ScreenComponent {...props} />
        </Provider>
      ),
      () => ScreenComponent,
    );
  } else {
    Navigation.registerComponent(name, () => ScreenComponent);
  }
}

export function createComponents(routes, parentId, Provider) {
  const components = {};

  Object.entries(routes).forEach(([name, ScreenComponent]) => {
    const id = parentId ? `${parentId}/${name}` : name;

    registerScreen(name, ScreenComponent, Provider);

    components[name] = new Component(
      id,
      name,
      Object.assign({}, ScreenComponent.options),
    );
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

      if (isObj && !nested.WrappedComponent && !blacklist.includes(key)) {
        depth = getObjDepth(nested, depth, blacklist);
      }

      maxDepth = Math.max(maxDepth, depth);
      depth = levelDepth;
    }

    depth = maxDepth;
  }

  return depth;
}
