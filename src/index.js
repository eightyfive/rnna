import React from 'react';
import { Navigation } from 'react-native-navigation';
import _mapValues from 'lodash.mapvalues';
import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import _pick from 'lodash.pick';
import _isEmpty from 'lodash.isempty';

import BottomTabNavigator from './BottomTabNavigator';
import Component from './Component';
import DrawerNavigator from './DrawerNavigator';
import ModalNavigator from './ModalNavigator';
import Navigator from './Navigator';
import OverlayNavigator from './OverlayNavigator';
import AppNavigator from './AppNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import WidgetComponent from './WidgetComponent';

const events = Navigation.events();

export function createStackNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigatorConfig = getStackNavigatorConfig(config);
  const navigators = createNavigators(routeConfigs, config, Provider, store);

  if (navigatorConfig.mode === 'modal') {
    return new ModalNavigator(navigators, navigatorConfig);
  }

  return new StackNavigator(navigators, navigatorConfig);
}

export function createModalNavigator(routes, config = {}) {
  config.mode = 'modal';

  return createStackNavigator(routes, config);
}

export function createOverlayNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);

  return new OverlayNavigator(navigators, config);
}

export function createBottomTabNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);
  const navigatorConfig = getBottomTabNavigatorConfig(config);

  return new BottomTabNavigator(navigators, navigatorConfig);
}

export function createDrawerNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigatorConfig = getDrawerNavigatorConfig(config);

  const { contentComponent } = navigatorConfig;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  navigatorConfig.drawer = createComponent(
    contentComponent.name,
    contentComponent,
    getComponentOptions(contentComponent),
    Provider,
    store,
  );

  const navigators = createNavigators(
    routeConfigs,
    navigatorConfig,
    Provider,
    store,
  );

  return new DrawerNavigator(navigators, navigatorConfig);
}

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);
  const navigatorConfig = getSwitchNavigatorConfig(config);

  return new SwitchNavigator(navigators, navigatorConfig);
}

export function createAppNavigator(
  routes,
  { store, Provider, ...config } = {},
) {
  const routeConfigs = createRouteConfigs(routes);
  const navigators = createNavigators(routeConfigs, config, Provider, store);

  return new AppNavigator(navigators, config);
}

function createRouteConfigs(routes) {
  return _mapValues(routes, route =>
    route.screen ? route : { screen: route },
  );
}

function createNavigators(routeConfigs, navigatorConfig, Provider, store) {
  return _mapValues(routeConfigs, (routeConfig, routeName) => {
    const { screen, options: routeOptions, navigationOptions } = routeConfig;

    if (screen instanceof Navigator) {
      return screen;
    }

    const { defaultOptions, defaultNavigationOptions } = navigatorConfig;

    const options = getComponentOptions(
      screen,
      routeOptions,
      navigationOptions,
      defaultOptions,
      defaultNavigationOptions,
    );

    return createComponent(
      routeName,
      routeConfig.screen,
      options,
      Provider,
      store,
    );
  });
}

function createComponent(name, Comp, options, Provider, store) {
  registerComponent(name, Comp, Provider, store);

  return new Component(name, { options });
}

export function createWidget(Comp, { store, Provider, ...config } = {}) {
  const component = new WidgetComponent(Comp.name);

  registerComponent(component.id, Comp, Provider, store);

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
  Comp,
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
    getNavigationOptions(Comp.navigationOptions || {}),
    routeOptions,
    typeof Comp.options !== 'function' ? Comp.options : {},
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

function registerComponent(id, Comp, Provider, store) {
  if (Provider) {
    Navigation.registerComponent(
      id,
      () => provideComponent(Comp, Provider, store),
      () => Comp,
    );
  } else {
    Navigation.registerComponent(id, () => Comp);
  }
}

function provideComponent(Comp, Provider, store) {
  return props => (
    <Provider {...{ store }}>
      <Comp {...props} />
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
