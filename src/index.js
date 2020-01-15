import React from 'react';
import { Navigation } from 'react-native-navigation';
import _mapValues from 'lodash/mapValues';
import _mergeWith from 'lodash/mergeWith';
import _set from 'lodash/set';
import _pick from 'lodash/pick';
import _isPlainObject from 'lodash/isPlainObject';
import _isEmpty from 'lodash/isEmpty';

import WidgetComponent from './WidgetComponent';
import {
  BottomTabNavigator,
  ComponentNavigator,
  DrawerNavigator,
  ModalNavigator,
  Navigator,
  OverlayNavigator,
  RootNavigator,
  StackNavigator,
  SwitchNavigator,
} from './navigators';

const events = Navigation.events();

export function createStackNavigator(routes, config = {}, Provider, store) {
  const routeConfigs = createRouteConfigs(routes);
  const navigatorConfig = getStackNavigatorConfig(config);
  const navigators = createNavigators(routeConfigs, config, Provider, store);

  if (navigatorConfig.mode === 'modal') {
    return new ModalNavigator(navigators, navigatorConfig);
  }

  return new StackNavigator(navigators, navigatorConfig);
}

export function createModalNavigator(routes, config = {}, Provider, store) {
  config.mode = 'modal';

  return createStackNavigator(routes, config, Provider, store);
}

export function createOverlayNavigator(
  Component,
  config = {},
  Provider,
  store,
) {
  registerComponent(Component.name, Component, Provider, store);

  return new OverlayNavigator(Component.name, config);
}

export function createBottomTabNavigator(routes, config = {}, Provider, store) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);
  const navigatorConfig = getBottomTabNavigatorConfig(config);

  return new BottomTabNavigator(navigators, navigatorConfig);
}

export function createDrawerNavigator(
  DrawerComponent,
  routes,
  config = {},
  Provider,
  store,
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigatorConfig = getDrawerNavigatorConfig(config);
  const navigators = createNavigators(
    routeConfigs,
    navigatorConfig,
    Provider,
    store,
  );

  const drawer = createComponentNavigator(
    DrawerComponent.name,
    DrawerComponent,
    getComponentOptions(DrawerComponent),
    Provider,
    store,
  );

  return new DrawerNavigator(navigators, drawer, navigatorConfig);
}

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(routes, config = {}, Provider, store) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);
  const navigatorConfig = getSwitchNavigatorConfig(config);

  return new SwitchNavigator(navigators, navigatorConfig);
}

export function createRootNavigator(routes, config = {}, Provider, store) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);

  return new RootNavigator(navigators, config);
}

function createRouteConfigs(routes) {
  return _mapValues(routes, (route, routeName) => {
    if (_isPlainObject(route)) {
      return route;
    }

    return {
      screen: route,
    };
  });
}

function createNavigators(routeConfigs, navigatorConfig, Provider, store) {
  return _mapValues(routeConfigs, (routeConfig, routeName) => {
    const { screen, options, navigationOptions } = routeConfig;

    if (screen instanceof Navigator) {
      return routeConfig;
    }

    const { defaultOptions, defaultNavigationOptions } = navigatorConfig;

    const options = getComponentOptions(
      screen,
      options,
      navigationOptions,
      defaultOptions,
      defaultNavigationOptions,
    );

    return createComponentNavigator(
      routeName,
      routeConfig.screen,
      options,
      Provider,
      store,
    );
  });
}

function createComponentNavigator(name, Component, options, Provider, store) {
  registerComponent(name, Component, Provider, store);

  return new ComponentNavigator(name, { options });
}

export function createWidget(Component, config = {}, Provider, store) {
  const component = new WidgetComponent(Component.name);

  registerComponent(component.id, Component, Provider, store);

  return component;
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

function getComponentOptions(
  Component,
  routeOptions = {},
  routeNavigationOptions = {},
  defaultOptions = {},
  defaultNavigationOptions = {},
) {
  const options = merge(
    {},
    getNavigationOptions(defaultNavigationOptions),
    defaultOptions,
    getNavigationOptions(routeNavigationOptions),
    getNavigationOptions(Component.navigationOptions || {}),
    routeOptions,
    typeof Component.options !== 'function' ? Component.options : {},
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

const navigatorConfigKeys = [
  'initialRouteName',
  'navigationOptions',
  'defaultOptions', // N/S
  'defaultNavigationOptions',
  'paths',
];

function getNavigatorConfig(config, keys) {
  return _pick(config, navigatorConfigKeys.concat(keys));
}

function registerComponent(id, Component, Provider, store) {
  if (Provider) {
    Navigation.registerComponent(
      id,
      () => provideComponent(Component, Provider, store),
      () => Component,
    );
  } else {
    Navigation.registerComponent(id, () => Component);
  }
}

function provideComponent(Component, Provider, store) {
  return props => (
    <Provider {...{ store }}>
      <Component {...props} />
    </Provider>
  );
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
