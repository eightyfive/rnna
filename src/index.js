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

export function createStackNavigator(routes, config = {}) {
  const navigators = createNavigators(routes, config);

  if (config.mode === 'modal') {
    return new ModalNavigator(navigators, config);
  }

  return new StackNavigator(navigators, config);
}

export function createModalNavigator(routes, config = {}) {
  config.mode = 'modal';

  return createStackNavigator(routes, config);
}

export function createOverlayNavigator(Component, config = {}) {
  registerComponent(Component.name, Component, config);

  return new OverlayNavigator(Component.name);
}

export function createBottomTabsNavigator(routes, config) {
  const navigators = createNavigators(routes, config);

  return new BottomTabsNavigator(navigators, config);
}

export function createDrawerNavigator(DrawerComponent, routes, config = {}) {
  const navigators = createNavigators(routes, config);

  const drawer = createComponentNavigator(
    config.drawerId || DrawerComponent.name,
    DrawerComponent,
    config,
  );

  return new DrawerNavigator(navigators, drawer, config);
}

export function createSwitchNavigator(routes, config = {}) {
  const navigators = createNavigators(routes, config);

  return new SwitchNavigator(navigators);
}

export function createRootNavigator(routes, config = {}) {
  return new RootNavigator(createNavigators(routes, config), config);
}

function createNavigators(routes, config) {
  return _mapValues(routes, (navigator, name) => {
    const isNavigator = navigator instanceof Navigator;

    if (!isNavigator) {
      return createComponentNavigator(name, navigator, config);
    }

    return navigator;
  });
}

function createComponentNavigator(name, route, config) {
  const [Component, options] = normalizeRoute(route, config);

  registerComponent(name, Component, config);

  config.options = options;

  return new ComponentNavigator(name, config);
}

export function createWidget(Component, config = {}) {
  const component = new WidgetComponent(Component.name);

  registerComponent(component.id, Component, config);

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

function normalizeRoute(route, config) {
  const Component = route.screen || route;
  const options = getComponentOptions(route, config);

  return [Component, options];
}

function getComponentOptions(route, config) {
  const { defaultOptions = {} } = config;
  const Component = route.screen || route;
  const routeConfig = route.screen ? route : {};

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

function getNavigationOptions(nav) {
  const options = {};

  if (!nav) {
    return options;
  }

  if (nav.header === null) {
    _set(options, 'topBar.visible', false);
    _set(options, 'topBar.drawBehind', true);
  } else {
    if (nav.title) {
      _set(options, 'topBar.title.text', nav.title);
    }

    if (nav.headerTintColor) {
      _set(options, 'topBar.title.color', nav.headerTintColor);
    }

    let style;

    style = nav.headerStyle;
    if (style && style.backgroundColor) {
      _set(options, 'topBar.background.color', style.backgroundColor);
    }

    style = nav.headerBackTitleStyle;
    if (style && style.color) {
      _set(options, 'topBar.backButton.color', style.color);
    }
  }

  return options;
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
