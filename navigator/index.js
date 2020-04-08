import { Navigation } from 'react-native-navigation';

import { getNavigationOptions } from './utils';
import WidgetComponent from './WidgetComponent';

export { default as createBottomTabsNavigator } from './createBottomTabsNavigator';
export { default as createDrawerNavigator } from './createDrawerNavigator';
export { default as createModalNavigator } from './createModalNavigator';
export { default as createOverlayNavigator } from './createOverlayNavigator';
export { default as createStackNavigator } from './createStackNavigator';
export { default as createSwitchNavigator } from './createSwitchNavigator';

export function createWidget(id, config = {}) {
  return new WidgetComponent(id);
}

const events = Navigation.events();

export function setDefaultOptions({ navigationOptions, ...options }) {
  const defaultOptions = merge(
    options,
    getNavigationOptions(navigationOptions || {}),
  );

  events.registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}
