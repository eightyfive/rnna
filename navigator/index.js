import { Navigation } from 'react-native-navigation';
import _mapValues from 'lodash.mapvalues';
import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import _pick from 'lodash.pick';
import _isEmpty from 'lodash.isempty';
import _isPlainObject from 'lodash.isplainobject';

import BottomTabsNavigator from './BottomTabsNavigator';
import Component from './Component';
import DrawerNavigator from './DrawerNavigator';
import ModalNavigator from './ModalNavigator';
import Navigator from './Navigator';
import Route from './Route';
import OverlayNavigator from './OverlayNavigator';
import AppNavigator from './AppNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import WidgetComponent from './WidgetComponent';

const events = Navigation.events();

export function createStackNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = Object.values(routes).some(
    route => route instanceof Navigator,
  );

  if (invalid) {
    throw new Error('`StackNavigator` only accepts `Component` children');
  }

  const navigatorConfig = getStackNavigatorConfig(config);

  if (navigatorConfig.mode === 'modal') {
    return new ModalNavigator(routes, navigatorConfig);
  }

  return new StackNavigator(routes, navigatorConfig);
}

export function createModalNavigator(routes, config = {}) {
  config.mode = 'modal';

  return createStackNavigator(routes, config);
}

export function createOverlayNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  if (Object.values(routes).length > 1) {
    throw new Error('`OverlayNavigator` only accepts one `Component` child');
  }

  return new OverlayNavigator(routes, config);
}

export function createBottomTabNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = Object.values(routes).some(
    route => !(route instanceof StackNavigator),
  );

  if (invalid) {
    throw new Error(
      '`BottomTabsNavigator` only accepts `StackNavigator` children',
    );
  }

  const navigatorConfig = getBottomTabNavigatorConfig(config);

  return new BottomTabsNavigator(routes, navigatorConfig);
}

export function createDrawerNavigator(routeConfigs, config = {}) {
  const navigatorConfig = getDrawerNavigatorConfig(config);

  const { contentComponent, contentOptions = {} } = navigatorConfig;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  navigatorConfig.drawer = createComponent(
    contentComponent,
    getComponentOptions(contentOptions),
  );

  const routes = createRoutes(routeConfigs);

  return new DrawerNavigator(routes, navigatorConfig);
}

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);
  const navigatorConfig = getSwitchNavigatorConfig(config);

  return new SwitchNavigator(routes, navigatorConfig);
}

export function createAppNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  return new AppNavigator(routes, config);
}

export function createRootNavigator(routes) {
  const app = {};

  for (const [k1, v1] of Object.entries(routes)) {
    const depth = getRouteDepth(v1);
    const { options, ...routeConfigs } = v1;

    if (depth === 2) {
      const stacks = {};

      for (const [k2, v2] of Object.entries(routeConfigs)) {
        stacks[k2] = createStackNavigator(v2);
      }

      app[k1] = createBottomTabNavigator(stacks, options);
    } else if (depth === 1) {
      app[k1] = createStackNavigator(routeConfigs, options);
    } else if (depth === 0) {
      app[k1] = createOverlayNavigator(routeConfigs, options);
    } else {
      throw new Error('Invalid routes obj');
    }
  }

  return createAppNavigator(app);
}

function createRoutes(routeConfigs) {
  return _mapValues(routeConfigs, routeConfig => {
    if (routeConfig instanceof Route) {
      return routeConfig;
    }

    const {
      componentId,
      options: routeOptions,
      navigationOptions,
    } = routeConfig;

    const options = getComponentOptions(routeOptions, navigationOptions);

    return createComponent(componentId, options);
  });
}

function createComponent(componentId, options) {
  return new Component(componentId, { options });
}

export function createWidget(componentId, config = {}) {
  return new WidgetComponent(componentId);
}

export function setDefaultOptions({ navigationOptions, ...options }) {
  const defaultOptions = merge(
    options,
    getNavigationOptions(navigationOptions || {}),
  );

  events.registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}

function getComponentOptions(routeOptions = {}, routeNavigationOptions = {}) {
  const options = merge(
    {},
    getNavigationOptions(routeNavigationOptions),
    routeOptions,
  );

  if (!_isEmpty(options)) {
    return options;
  }

  // return undefined;
}

function getNavigationOptions(navigationOptions) {
  const options = {};

  const {
    header,
    headerTintColor,
    headerStyle,
    headerBackTitleStyle,
    title,
  } = navigationOptions;

  if (header === null) {
    _set(options, 'topBar.visible', false);
    _set(options, 'topBar.drawBehind', true);
  } else {
    if (title) {
      _set(options, 'topBar.title.text', title);
    }

    if (headerTintColor) {
      _set(options, 'topBar.title.color', headerTintColor);
    }

    if (headerStyle && headerStyle.backgroundColor) {
      _set(options, 'topBar.background.color', style.backgroundColor);
    }

    if (headerBackTitleStyle && headerBackTitleStyle.color) {
      _set(options, 'topBar.backButton.color', headerBackTitleStyle.color);
    }
  }

  return options;
}

// https://reactnavigation.org/docs/en/stack-navigator.html#stacknavigatorconfig
function getStackNavigatorConfig(config) {
  return getNavigatorConfig(config, [
    'initialRouteParams',
    'initialRouteKey',
    'mode',
    'headerMode',
  ]);
}

// https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig
function getBottomTabNavigatorConfig(config) {
  return getNavigatorConfig(config, [
    'resetOnBlur',
    'order',
    'backBehavior',
    'lazy',
    'tabBarComponent',
    'tabBarOptions',
  ]);
}

// https://reactnavigation.org/docs/en/drawer-navigator.html#drawernavigatorconfig
function getDrawerNavigatorConfig(config) {
  return getNavigatorConfig(config, [
    'drawerBackgroundColor',
    'drawerPosition',
    'drawerType',
    'drawerWidth',
    'edgeWidth',
    'hideStatusBar',
    'statusBarAnimation',
    'keyboardDismissMode',
    'minSwipeDistance',
    'overlayColor',
    'gestureHandlerProps',
    'lazy',
    'unmountInactiveRoutes',
    'contentComponent',
    'contentOptions',
    //
    'order',
    'backBehavior',
  ]);
}

// https://reactnavigation.org/docs/en/switch-navigator.html#switchnavigatorconfig
function getSwitchNavigatorConfig(config) {
  return getNavigatorConfig(config, ['resetOnBlur', 'backBehavior']);
}

const navigatorConfigKeys = ['initialRouteName', 'navigationOptions', 'paths'];

function getNavigatorConfig(
  { defaultOptions, defaultNavigationOptions, ...config },
  keys,
) {
  const navigatorConfig = _pick(config, navigatorConfigKeys.concat(keys));

  if (defaultOptions || defaultNavigationOptions) {
    navigatorConfig.defaultOptions = Object.assign(
      {},
      getNavigationOptions(defaultNavigationOptions || {}),
      defaultOptions,
    );
  }

  return navigatorConfig;
}

// function customizer(objValue, srcValue, key, object, source, stack)
function mergeCustomizer(objValue, srcValue, key) {
  if (key === 'rightButtons' || key === 'leftButtons') {
    return srcValue;
  }

  return undefined;
}

function merge(dest, ...sources) {
  return _mergeWith(dest, ...sources, mergeCustomizer);
}

// Traverse obj for depth
function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of Object.entries(route)) {
    const isObject = _isPlainObject(val);

    if (isObject && !_options[key]) {
      currentDepth++;
      depth = getRouteDepth(val, currentDepth, depth);
    } else {
      depth = Math.max(currentDepth, depth);
    }

    currentDepth = 0;
  }

  return depth;
}

const _options = {
  topBar: true,
  layout: true,
};
