import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import _pick from 'lodash.pick';
import _isEmpty from 'lodash.isempty';
import _isPlainObject from 'lodash.isplainobject';

import Component from './Component';
import Route from './Route';

export function createRoutes(routeConfigs) {
  const routes = {};

  for (const [id, routeConfig] of Object.entries(routeConfigs)) {
    if (routeConfig instanceof Route) {
      routes[id] = routeConfig;
    } else {
      const { options: routeOptions, navigationOptions } = routeConfig;

      const options = getComponentOptions(routeOptions, navigationOptions);

      routes[id] = createComponent(id, options);
    }
  }

  return routes;
}

export function createComponent(id, options) {
  return new Component(id, { options });
}

export function getComponentOptions(
  routeOptions = {},
  routeNavigationOptions = {},
) {
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

export function getNavigationOptions(navigationOptions) {
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
export function getStackNavigatorConfig(config) {
  return getNavigatorConfig(config, [
    'initialRouteParams',
    'initialRouteKey',
    'mode',
    'headerMode',
  ]);
}

// https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig
export function getBottomTabNavigatorConfig(config) {
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
export function getDrawerNavigatorConfig(config) {
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
export function getSwitchNavigatorConfig(config) {
  return getNavigatorConfig(config, ['resetOnBlur', 'backBehavior']);
}

const navigatorConfigKeys = ['initialRouteName', 'navigationOptions', 'paths'];

export function getNavigatorConfig(
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
export function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of Object.entries(route)) {
    const isObject = _isPlainObject(val) && !_options[key];
    const isEmpty = _isEmpty(val);

    if (isObject) {
      currentDepth++;
    }

    if (isObject && !isEmpty) {
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
