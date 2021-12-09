import { Component, Widget } from './Layouts';
import { createComponents, getRouteType } from './utils';
import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import StackNavigator from './StackNavigator';

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

export function createComponent(id, name, ReactComponent, options = {}) {
  return new Component(id, name, ReactComponent, options);
}

export function createStackNavigator(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new StackNavigator(components, restConfig);
}

export function createModalNavigator(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId);

  return new ModalNavigator(components, restConfig);
}

export function createOverlayNavigator(id, name, ReactComponent, options) {
  return new OverlayNavigator(id, name, ReactComponent, options);
}

export function createWidget(name, ReactComponent, options) {
  return new Widget(name, ReactComponent, options);
}

export function createRootNavigator(routes) {
  const navigators = createNavigatorsFromRoutes(routes);

  return new RootNavigator(navigators);
}

export function createNavigatorsFromRoutes(obj) {
  const navigators = {};

  Object.entries(obj).forEach(([name, route]) => {
    const type = getRouteType(route);

    if (type === 'overlay') {
      navigators[name] = createOverlayNavigator(name, name, route);
    } else {
      const { config = {}, ...routes } = route;

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
            `Invalid route (too deep): ${JSON.stringify(route, null, 2)}`,
          );
      }
    }
  });

  return navigators;
}
