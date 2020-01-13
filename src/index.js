import React from 'react';
import { Navigation } from 'react-native-navigation';
import _mergeWith from 'lodash/mergeWith';

import * as Layout from './Layout';
import ComponentNavigator from './ComponentNavigator';
import Navigator from './Navigator';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import StackNavigator from './StackNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import SwitchNavigator from './SwitchNavigator';

const events = Navigation.events();

export function createStackNavigator(routes, navigatorConfig = {}) {
  const stack = createStack(routes, navigatorConfig);

  if (navigatorConfig.mode === 'modal') {
    return new ModalNavigator(stack, navigatorConfig);
  }

  return new StackNavigator(stack, navigatorConfig);
}

export function createModalNavigator(routes, config = {}) {
  config.mode = 'modal';

  return createStackNavigator(routes, config);
}

export function createOverlayNavigator(Component, navigatorConfig = {}) {
  const options = getComponentOptions(Component, navigatorConfig);

  const overlay = createOverlayComponent(
    name,
    options,
    Component,
    navigatorConfig,
  );

  return new OverlayNavigator(overlay);
}

export function createBottomTabNavigator(routes, config) {
  // return new BottomTabNavigator(bottomTabs, config);

  // TODO
  return null;
}

// export function createBottomTabNavigator(id, routes, navigatorConfig = {}) {
//   const navigators = [];
//   const bottomTabs = new Layout.BottomTabs(id, [], navigatorConfig.options);

//   Object.keys(routes).forEach(name => {
//     const navigator = routes[name];

//     if (!(navigator instanceof StackNavigator)) {
//       throw new Error(
//         'BottomTabNavigator only accepts StackNavigator children',
//       );
//     }

//     bottomTabs.children.push(navigator.stack);

//     navigators.push(navigator);
//   });

//   return new BottomTabNavigator(id, navigators, bottomTabs, navigatorConfig);
// }

// TODO: https://reactnavigation.org/docs/en/drawer-navigator.html
export function createDrawerNavigator(
  DrawerComponent,
  routes,
  navigatorConfig = {},
) {
  // Drawer
  const drawer = createComponent(
    'Drawer',
    {},
    DrawerComponent,
    navigatorConfig,
  );

  // sideMenu
  const sideMenu = createSideMenu(drawer, routes, navigatorConfig);

  return new DrawerNavigator(sideMenu);
}

export function createSwitchNavigator(routes, navigatorConfig = {}) {
  const navigators = getNavigators(routes, navigatorConfig);

  return new SwitchNavigator(navigators);
}

export function createRootNavigator(routes, navigatorConfig = {}) {
  return new RootNavigator(
    getNavigators(routes, navigatorConfig),
    navigatorConfig,
  );
}

function getNavigators(routes, navigatorConfig) {
  Object.keys(routes).forEach(name => {
    const navigator = routes[name];

    if (!(navigator instanceof Navigator)) {
      const [Component, options] = normalizeRoute(navigator, navigatorConfig);

      const component = createComponent(
        name,
        options,
        Component,
        navigatorConfig,
      );

      routes[name] = new ComponentNavigator(component);
    }
  });

  return routes;
}

export function createWidget(id, Component, config) {
  return createWidgetComponent(id, {}, Component, config);
}

export function setDefaultOptions({ navigationOptions, ...options }) {
  const defaultOptions = merge(
    options,
    Layout.getNavigationOptions(navigationOptions),
  );

  events.registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}

function createStack(routes, navigatorConfig) {
  const children = [];

  Object.keys(routes).forEach(name => {
    const [Component, options] = normalizeRoute(routes[name], navigatorConfig);

    children.push(createComponent(name, options, Component, navigatorConfig));
  });

  return new Layout.Stack(children, navigatorConfig.defaultOptions);
}

function createSideMenu(drawer, routes, navigatorConfig, config = {}) {
  const center = createStack(`${drawer.id}-Center`, routes, navigatorConfig);

  return new Layout.SideMenu(
    drawer,
    center,
    navigatorConfig.defaultOptions || {},
    config,
  );
}

function createComponent(id, options, Component, config) {
  const component = new Layout.Component(id, options);

  registerComponent(component.id, Component, config);

  return component;
}

function createOverlayComponent(id, options, Component, config) {
  const component = new Layout.OverlayComponent(id, options);

  registerComponent(component.id, Component, config);

  return component;
}

function createWidgetComponent(id, options, Component, config) {
  const component = new Layout.WidgetComponent(id, options);

  registerComponent(component.id, Component, config);

  return component;
}

function normalizeRoute(route, navigatorConfig) {
  const Component = route.screen || route;
  const options = getComponentOptions(route, navigatorConfig);

  return [Component, options];
}

function getComponentOptions(route, navigatorConfig) {
  const { defaultOptions = {} } = navigatorConfig;
  const Component = route.screen || route;
  const routeConfig = route.screen ? route : {};

  return merge(
    {},
    defaultOptions,
    Layout.getNavigationOptions(defaultOptions.navigationOptions),
    Layout.getNavigationOptions(routeConfig.navigationOptions),
    Layout.getNavigationOptions(Component.navigationOptions),
    routeConfig.options,
    typeof Component.options !== 'function' ? Component.options : {},
  );
}

function registerComponent(id, Component, { Provider, store }) {
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
