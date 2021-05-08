import _isObject from 'lodash.isplainobject';

import BottomTabsNavigator from './BottomTabsNavigator';
import Component from './Component';
import ModalNavigator from './ModalNavigator';
// import SideMenuNavigator from './SideMenuNavigator';
import RootNavigator from './RootNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import OverlayNavigator from './OverlayNavigator';
import WidgetComponent from './WidgetComponent';

export { default as Registry } from './Registry';

export function createBottomTabs(tabs, config = {}) {
  const bottomTabs = new BottomTabsNavigator(config);

  Object.entries(tabs).forEach(([tabName, tabConfig]) => {
    const { config: stackConfig = {}, ...nestedRoutes } = tabConfig;

    stackConfig.parentId = tabName;

    const stack = createStack(nestedRoutes, stackConfig);

    bottomTabs.addRoute(tabName, stack);
  });

  return bottomTabs;
}

export function createOverlay(componentName, ReactComponent, config = {}) {
  const { parentId, ...restConfig } = config;

  const overlay = new OverlayNavigator(restConfig);

  const component = Component.register(
    parentId ? `${parentId}/${componentName}` : componentName,
    componentName,
    ReactComponent,
    config.options || {},
  );

  overlay.addRoute(componentName, component);

  return overlay;
}

export function createSideMenu(routes, config = {}) {
  // TODO
}

export function createStack(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const stack = new StackNavigator(restConfig);

  const components = createComponents(routes, parentId);

  components.forEach(([name, component]) => {
    stack.addRoute(name, component);
  });

  return stack;
}

export function createModal(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const modal = new ModalNavigator(restConfig);

  const components = createComponents(routes, parentId);

  components.forEach(([name, component]) => {
    modal.addRoute(name, component);
  });

  return modal;
}

export function createSwitch(navigators, config = {}) {
  const switchNavigator = new SwitchNavigator(config);

  Object.entries(navigators).forEach(([name, navigator]) => {
    switchNavigator.addRoute(name, navigator);
  });

  return switchNavigator;
}

export function createWidget(name, Widget) {
  return WidgetComponent.register(name, Widget);
}

export function createRoot(routes, config = {}) {
  const root = new RootNavigator(config);

  Object.entries(routes).forEach(([name, route]) => {
    const type = getRouteType(route);

    if (type === 'overlay') {
      root.addOverlay(name, createOverlay(name, route));
    } else {
      const { config: navigatorConfig = {}, ...nestedRoutes } = route;

      navigatorConfig.parentId = name;

      if (type === 'bottomTabs') {
        root.addRoute(name, createBottomTabs(nestedRoutes, navigatorConfig));
      } else if (type === 'stack') {
        root.addRoute(name, createStack(nestedRoutes, navigatorConfig));
      } else if (type === 'modal') {
        root.addModal(name, createModal(nestedRoutes, navigatorConfig));
      } else {
        throw new Error(
          `Invalid route (too deep): ${JSON.stringify(route, null, 2)}`,
        );
      }
    }
  });

  return root;
}

function createComponents(routes, parentId) {
  return Object.entries(routes).map(([componentName, ReactComponent]) => {
    const component = Component.register(
      parentId ? `${parentId}/${componentName}` : componentName,
      componentName,
      ReactComponent,
      ReactComponent.options || {},
    );

    return [componentName, component];
  });
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
