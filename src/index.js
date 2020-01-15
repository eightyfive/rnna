import React from 'react';
import { Navigation } from 'react-native-navigation';
import _mapValues from 'lodash/mapValues';
import _mergeWith from 'lodash/mergeWith';
import _set from 'lodash/set';

import WidgetComponent from './WidgetComponent';
import ComponentNavigator from './ComponentNavigator';
import Navigator from './Navigator';
import BottomTabsNavigator from './BottomTabsNavigator';
import DrawerNavigator from './DrawerNavigator';
import StackNavigator from './StackNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import SwitchNavigator from './SwitchNavigator';

const events = Navigation.events();

export function createStackNavigator(routes, config = {}, Provider, store) {
  const navigators = createNavigators(routes, config, Provider, store);

  if (config.mode === 'modal') {
    return new ModalNavigator(navigators, config);
  }

  return new StackNavigator(navigators, config);
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

export function createBottomTabsNavigator(
  routes,
  config = {},
  Provider,
  store,
) {
  const navigators = createNavigators(routes, config, Provider, store);

  return new BottomTabsNavigator(navigators, config);
}

export function createDrawerNavigator(
  DrawerComponent,
  routes,
  config = {},
  Provider,
  store,
) {
  const navigators = createNavigators(routes, config, Provider, store);

  const drawer = createComponentNavigator(
    DrawerComponent,
    config,
    Provider,
    store,
  );

  return new DrawerNavigator(navigators, drawer, config);
}

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(routes, config = {}, Provider, store) {
  const navigators = createNavigators(routes, config, Provider, store);

  return new SwitchNavigator(navigators);
}

export function createRootNavigator(routes, config = {}, Provider, store) {
  const navigators = createNavigators(routes, config, Provider, store);

  return new RootNavigator(navigators, config);
}

function createNavigators(routes, config, Provider, store) {
  return _mapValues(routes, (navigator, name) => {
    const isNavigator = navigator instanceof Navigator;

    if (!isNavigator) {
      return createComponentNavigator(navigator, config, Provider, store);
    }

    return navigator;
  });
}

function createComponentNavigator(route, config, Provider, store) {
  const Component = route.screen || route;
  const routeConfig = route.screen ? route : {};

  registerComponent(Component.name, Component, Provider, store);

  config.options = getComponentOptions(
    Component,
    routeConfig,
    config.defaultOptions,
  );

  return new ComponentNavigator(Component.name, config);
}

export function createWidget(Component, config = {}, Provider, store) {
  const component = new WidgetComponent(Component.name);

  registerComponent(component.id, Component, Provider, store);

  return component;
}

export function setDefaultOptions({ navigationOptions, ...options }) {
  const defaultOptions = merge(
    options,
    getNavigationOptions(navigationOptions),
  );

  events.registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}

function getComponentOptions(Component, routeConfig, defaultOptions = {}) {
  const options = merge(
    {},
    defaultOptions,
    getNavigationOptions(defaultOptions.navigationOptions),
    getNavigationOptions(routeConfig.navigationOptions),
    getNavigationOptions(Component.navigationOptions),
    routeConfig.options,
    typeof Component.options !== 'function' ? Component.options : {},
  );

  if (Object.keys(options).length) {
    return options;
  }

  // return undefined;
}

function getNavigationOptions(navigationOptions) {
  const options = {};

  if (!navigationOptions) {
    return options;
  }

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
function getStackNavigatorConfig() {
  return;
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
