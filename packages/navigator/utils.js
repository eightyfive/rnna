import { Navigation } from 'react-native-navigation';
import React from 'react';
import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import _set from 'lodash.set';

import Component from './Component';

const o = {
  assign: Object.assign,
  entries: Object.entries,
};

export function createComponents(screens) {
  return _mapValues(screens, (Screen, id) => createComponent(id, Screen));
}

export function createComponent(id, Screen) {
  registerComponent(id, Screen);

  return new Component(id, o.assign({}, toWixOptions(Screen.options || {})));
}

// Traverse obj for depth
export function getRouteDepth(route, currentDepth = 0, depth = 0) {
  for (const [key, val] of o.entries(route)) {
    const isRoute = key !== 'config' && key !== 'options';
    const isDeep = isRoute && _isObject(val);

    if (isDeep) {
      currentDepth++;
    }

    if (isDeep) {
      depth = getRouteDepth(val, currentDepth, depth);
    } else {
      depth = Math.max(currentDepth, depth);
    }

    currentDepth = 0;
  }

  return depth;
}

export function toWixOptions({
  // headerMode,

  // https://reactnavigation.org/docs/stack-navigator/#options
  title,
  header,
  headerShown,
  headerTitle,
  headerTitleAlign,
  // headerTitleAllowFontScaling,
  // headerBackAllowFontScaling,
  // headerBackImage,
  headerBackTitle,
  headerBackTitleVisible,
  // headerTruncatedBackTitle,
  // headerRight,
  // headerLeft,
  headerStyle,
  headerTitleStyle,
  headerBackTitleStyle,
  // headerLeftContainerStyle,
  // headerRightContainerStyle,
  // headerTitleContainerStyle,
  headerTintColor,
  // headerPressColorAndroid,
  headerTransparent,
  headerBackground,
  // headerStatusBarHeight,
  // cardShadowEnabled,
  // cardOverlayEnabled,
  // cardOverlay,
  // cardStyle,
  // animationEnabled,
  // animationTypeForReplace,
  // gestureEnabled,
  // gestureResponseDistance,
  // gestureVelocityImpact,
  // gestureDirection,
  // transitionSpec,
  // cardStyleInterpolator,
  // headerStyleInterpolator,
  // safeAreaInsets,

  // https://reactnavigation.org/docs/drawer-navigator#options
  // drawerLabel,
  // drawerIcon,
  // swipeEnabled,
  // unmountOnBlur,

  // https://reactnavigation.org/docs/bottom-tab-navigator#options
  tabBarVisible,
  tabBarIcon,
  tabBarLabel,
  // tabBarButton,
  // tabBarAccessibilityLabel,
  // tabBarTestID,

  // https://reactnavigation.org/docs/bottom-tab-navigator#props
  // tabBar,
  tabBarOptions,
  ...options
}) {
  if (header === null || headerShown === false) {
    _set(options, 'topBar.visible', false);
    _set(options, 'topBar.drawBehind', true);
  } else {
    if (title) {
      _set(options, 'topBar.title.text', title);
    }

    if (headerTitle) {
      _set(options, 'topBar.title.component.name', headerTitle);
    }

    if (headerTitleAlign) {
      _set(options, 'topBar.title.component.alignment', headerTitleAlign);
    }

    if (headerBackTitle) {
      _set(options, 'topBar.backButton.title', headerBackTitle);
    }

    if (headerBackTitleVisible === false) {
      _set(options, 'topBar.backButton.showTitle', false);
    }

    if (headerStyle) {
      if (headerStyle.backgroundColor) {
        _set(options, 'topBar.background.color', headerStyle.backgroundColor);
      }
    }

    if (headerTitleStyle) {
      if (headerTitleStyle.color) {
        _set(options, 'topBar.title.color', headerTitleStyle.color);
      }
      if (headerTitleStyle.fontFamily) {
        _set(options, 'topBar.title.fontFamily', headerTitleStyle.fontFamily);
      }
      if (headerTitleStyle.fontSize) {
        _set(options, 'topBar.title.fontSize', headerTitleStyle.fontSize);
      }
      if (headerTitleStyle.fontWeight) {
        _set(options, 'topBar.title.fontWeight', headerTitleStyle.fontWeight);
      }
    }

    if (headerBackTitleStyle) {
      if (headerBackTitleStyle.color) {
        _set(options, 'topBar.backButton.color', headerBackTitleStyle.color);
      }
    }

    if (headerTransparent) {
      _set(options, 'topBar.drawBehind', true);
    }

    if (headerBackground) {
      _set(options, 'topBar.background.component.name', headerBackground);
    }

    if (headerTintColor) {
      _set(options, 'topBar.title.color', headerTintColor);
      _set(options, 'topBar.backButton.color', headerTintColor);
    }
  }

  // https://reactnavigation.org/docs/bottom-tab-navigator#tabbaroptions
  if (tabBarOptions) {
    if (tabBarOptions.activeTintColor) {
      _set(
        options,
        'bottomTab.selectedTextColor',
        tabBarOptions.activeTintColor,
      );
      _set(
        options,
        'bottomTab.selectedIconColor',
        tabBarOptions.activeTintColor,
      );
    }

    if (tabBarOptions.inactiveTintColor) {
      _set(options, 'bottomTab.textColor', tabBarOptions.inactiveTintColor);
      _set(options, 'bottomTab.iconColor', tabBarOptions.inactiveTintColor);
    }

    if (tabBarOptions.inactiveBackgroundColor) {
      _set(
        options,
        'bottomTabs.backgroundColor',
        tabBarOptions.inactiveBackgroundColor,
      );
    }
  }

  if (tabBarVisible === false) {
    _set(options, 'bottomTabs.visible', false);
  }

  if (tabBarIcon) {
    _set(options, 'bottomTab.icon', tabBarIcon);
  }

  if (tabBarLabel) {
    _set(options, 'bottomTab.text', tabBarLabel);
  }

  // tabBarButton,

  return options;
}

export function registerComponent(name, Screen, Provider = null, store = null) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => props => (
        <Provider {...{ store }}>
          <Screen {...props} />
        </Provider>
      ),
      () => Screen,
    );
  } else {
    Navigation.registerComponent(name, () => Screen);
  }
}
