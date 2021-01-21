import { Navigation } from 'react-native-navigation';

import _pick from 'lodash.pick';
import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import Router from './Router';
import SideMenuNavigator from './SideMenuNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import WidgetComponent from './WidgetComponent';

import { createComponents, createComponent, getRouteDepth } from './utils';

export { default as registerComponents } from './registerComponents';

const o = Object;

export function createBottomTabsNavigator(tabs, options = {}, config = {}) {
  const stacks = _mapValues(tabs, (tab, tabId) => {
    const {
      options: stackOptions = {},
      config: stackConfig = {},
      ...screens
    } = tab;

    stackConfig.parentId = config.parentId
      ? `${config.parentId}/${tabId}`
      : tabId;

    return createStackNavigator(screens, stackOptions || {}, stackConfig);
  });

  return new BottomTabsNavigator(stacks, options, config);
}

export function createSideMenuNavigator(screens, config = {}) {
  const routes = createComponents(screens);

  const { contentComponent, contentOptions = {} } = config;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  config.drawer = createComponent(contentComponent, contentOptions);

  return new SideMenuNavigator(routes, options, config);
}

export function createRootNavigator(routes) {
  return new RootNavigator(createRoutes(routes));
}

export function createRouter(routes, services = {}) {
  const screens = findScreens(routes, new Map());

  return new Router(createRoutes(routes), screens, services);
}

function findScreens(routes, screens, parentId = null) {
  for (const [key, route] of o.entries(routes)) {
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

export function createStackNavigator(screens, options = {}, config = {}) {
  const components = createComponents(screens);

  if (config.mode === 'modal') {
    return new ModalNavigator(components, options, config);
  }

  return new StackNavigator(components, options, config);
}

// TODO
// https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(routes, options = {}, config = {}) {
  return new SwitchNavigator(createRoutes(routes), options, config);
}

export function createWidget(id) {
  return new WidgetComponent(id);
}

export function setDefaultOptions(defaultOptions) {
  Navigation.events().registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}

function createRoutes(routes) {
  return _mapValues(routes, (route, id) => {
    const isOverlay = !_isObject(route);

    if (isOverlay) {
      return new OverlayNavigator(createComponent(id, route));
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
