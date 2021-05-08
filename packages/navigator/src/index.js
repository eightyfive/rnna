import _isObject from 'lodash.isplainobject';

// import SideMenuNavigator from './SideMenuNavigator';
import RootNavigator from './RootNavigator';
import WidgetComponent from './WidgetComponent';
import { createComponents } from './utils';
import { BottomTabs, Modal, Overlay, Stack } from './Layouts';

export { default as Registry } from './Registry';

export function createBottomTabs(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const stacks = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStack(components, stackConfig);
  });

  return new BottomTabs(stacks, restConfig);
}

export function createStack(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new Stack(components, restConfig);
}

export function createModal(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new Modal(components, restConfig);
}

export function createWidget(name, Widget) {
  return WidgetComponent.register(name, Widget);
}

export function createRootNavigator(routes, config = {}) {
  const layouts = {};

  const modals = new Map();
  const overlays = new Map();

  Object.entries(routes).forEach(([name, route]) => {
    const type = getRouteType(route);

    if (type === 'overlay') {
      overlays.set(name, new Overlay(name, name, route));
    } else {
      const { config: layoutConfig = {}, ...nestedRoutes } = route;

      layoutConfig.parentId = name;

      if (type === 'bottomTabs') {
        layouts[name] = createBottomTabs(nestedRoutes, layoutConfig);
      } else if (type === 'stack') {
        layouts[name] = createStack(nestedRoutes, layoutConfig);
      } else if (type === 'modal') {
        modals.set(name, createModal(nestedRoutes, layoutConfig));
      } else {
        throw new Error(
          `Invalid route (too deep): ${JSON.stringify(route, null, 2)}`,
        );
      }
    }
  });

  const root = new RootNavigator(layouts, config);

  modals.forEach((modal, name) => {
    root.addModal(name, modal);
  });

  overlays.forEach((overlay, name) => {
    root.addOverlay(name, overlay);
  });

  return root;
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
