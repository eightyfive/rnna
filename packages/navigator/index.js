import flatten from 'flat';

import { Component, Widget } from './Layouts';
import { createComponents, getRouteType, registerScreen } from './utils';
import BottomTabsNavigator from './BottomTabsNavigator';
import Modal from './Modal';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import Stack from './Stack';

export function createBottomTabsNavigator(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const stacks = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStackNavigator(components, stackConfig);
  });

  return new BottomTabsNavigator(stacks, restConfig);
}

export function createStackNavigator(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new Stack(components, restConfig);
}

export function createModalNavigator(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new Modal(components, restConfig);
}

export function createOverlayNavigator(id, name, ScreenComponent, options) {
  return new OverlayNavigator(
    id,
    name,
    Object.assign({}, ScreenComponent.options, options),
  );
}

export function createComponent(id, name, options) {
  return new Component(id, name || id, options);
}

export function createWidget(name, options) {
  return new Widget(name, options);
}

export function createRootNavigator(defs) {
  const navigators = {};

  Object.entries(defs).forEach(([name, def]) => {
    const type = getRouteType(def);

    if (type === 'overlay') {
      navigators[name] = createOverlayNavigator(name, name, def);
    } else {
      const { config = {}, ...routes } = def;

      config.parentId = name;

      switch (type) {
        case 'bottomTabs':
          navigators[name] = createBottomTabsNavigator(routes, config);
          break;

        case 'modal':
          navigators[name] = createModalNavigator(routes, config);
          break;

        case 'stack':
          navigators[name] = createStackNavigator(routes, config);
          break;

        default:
          throw new Error(
            `Invalid route (too deep): ${JSON.stringify(def, null, 2)}`,
          );
      }
    }
  });

  return new RootNavigator(navigators);
}

export { registerScreen };

export function registerRoutes(routes, Provider) {
  const screens = flatten(routes);

  for (const [id, ScreenComponent] of Object.entries(screens)) {
    const isConfig = id.indexOf('.config.') !== -1;

    if (!isConfig) {
      const name = id.split('.').pop();

      registerScreen(name, ScreenComponent, Provider);
    }
  }
}
