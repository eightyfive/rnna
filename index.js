import React from "react";
import { Navigation } from "react-native-navigation";
import _merge from "lodash.merge";

import App from "./src/App";
import * as Layout from "./src/Layout";
import ComponentNavigator from "./src/ComponentNavigator";
import Navigator from "./Navigator";
import BottomTabNavigator from "./BottomTabNavigator";
import DrawerNavigator from "./src/DrawerNavigator";
import StackNavigator from "./src/StackNavigator";
import ModalNavigator from "./src/ModalNavigator";
import SwitchNavigator from "./src/SwitchNavigator";

export function createStackNavigator(routes, navigatorConfig = {}) {
  const stack = createStack(routes, navigatorConfig);

  if (navigatorConfig.mode === "modal") {
    return new ModalNavigator(Navigation, stack, navigatorConfig);
  }

  return new StackNavigator(Navigation, stack, navigatorConfig);
}

export function createModalNavigator(routes, config = {}) {
  config.mode = "modal";

  return createStackNavigator(routes, config);
}

export function createOverlays(routes, config) {
  return createComponents(routes, config, factories.Overlay);
}

export function createBottomTabNavigator(routes, config) {
  // TODO
  // navigation, bottomTabs, config = {}
  return new BottomTabNavigator(Navigation, bottomTabs, config);
}

export function createDrawerNavigator(
  DrawerComponent,
  routes,
  navigatorConfig = {}
) {
  // Drawer
  const drawer = createComponent(
    "Drawer",
    {},
    DrawerComponent,
    navigatorConfig,
    factories.Component
  );

  // sideMenu
  const sideMenu = createSideMenu(drawer, routes, navigatorConfig);

  return new DrawerNavigator(Navigation, sideMenu);
}

export function createSwitchNavigator(routes, navigatorConfig = {}) {
  const navigators = [];

  Object.keys(routes).forEach(name => {
    const route = routes[name];

    let navigator;

    if (route instanceof Navigator) {
      navigator = route;
    } else {
      const [Component, options] = normalizeRoute(route, navigatorConfig);

      const component = createComponent(
        name,
        options,
        Component,
        navigatorConfig,
        factories.Component
      );

      navigator = new ComponentNavigator(Navigation, component);
    }

    navigator.name = name;
    navigators.push(navigator);
  });

  return new SwitchNavigator(navigators, navigatorConfig);
}

export function createWidget(name, Component, config) {
  return createComponent(name, {}, Component, config, factories.Widget);
}

export function createApp(navigator, options) {
  return new App(Navigation, navigator, options);
}

export function setDefaultOptions({ navigationOptions, ...options }) {
  const defaultOptions = _merge(
    options,
    Layout.getNavigationOptions(navigationOptions)
  );

  Navigation.events().registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions)
  );
}

function createStack(routes, navigatorConfig) {
  const children = createComponents(
    routes,
    navigatorConfig,
    factories.Component
  );

  return new Layout.Stack(children, navigatorConfig.defaultOptions);
}

function createSideMenu(drawer, routes, navigatorConfig) {
  const center = createStack(routes, navigatorConfig);

  return new Layout.SideMenu(drawer, center);
}

function createComponents(routes, config, factory) {
  const components = [];

  Object.keys(routes).forEach(name => {
    const [Component, options] = normalizeRoute(routes[name], config);

    components.push(createComponent(name, options, Component, config, factory));
  });

  return components;
}

function createComponent(name, options, Component, config, factory) {
  const component = factory(name, options);

  registerComponent(component.name, Component, config);

  return component;
}

const factories = {
  Component(name, options) {
    return new Layout.Component(name, options);
  },

  Overlay(name, options) {
    return new Layout.OverlayComponent(name, options);
  },

  Widget(name, options) {
    return new Layout.WidgetComponent(name, options);
  }
};

function normalizeRoute(route, navigatorConfig) {
  const Component = route.screen || route;
  const options = getComponentOptions(route, navigatorConfig);

  return [Component, options];
}

function getComponentOptions(route, navigatorConfig) {
  const { defaultOptions = {} } = navigatorConfig;
  const Component = route.screen || route;
  const routeConfig = route.screen ? route : {};
  const { options, navigationOptions } = routeConfig;

  return _merge(
    {},
    defaultOptions,
    Layout.getNavigationOptions(defaultOptions.navigationOptions),
    options,
    Layout.getNavigationOptions(navigationOptions),
    Layout.getNavigationOptions(Component.navigationOptions)
  );
}

function registerComponent(name, Component, { Provider, store }) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => provideComponent(Component, Provider, store),
      () => Component
    );
  } else {
    Navigation.registerComponent(name, () => Component);
  }
}

function provideComponent(Component, Provider, store) {
  return props => (
    <Provider {...{ store }}>
      <Component {...props} />
    </Provider>
  );
}
