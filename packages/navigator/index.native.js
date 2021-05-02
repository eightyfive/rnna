import { Navigation } from 'react-native-navigation';

import _mapValues from 'lodash.mapvalues';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import SideMenuNavigator from './SideMenuNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import OverlayNavigator from './OverlayNavigator';
import WidgetComponent from './WidgetComponent';

import { createComponents, createComponent } from './utils';

export { default as registerComponents } from './registerComponents';

export function createBottomTabsNavigator(tabs, options = {}, config = {}) {
  const stacks = _mapValues(tabs, (tab, tabId) => {
    const {
      options: stackOptions = {},
      config: stackConfig = {},
      ...screens
    } = tab;

    stackConfig.parentId = config.parentId
      ? `${config.parentId}/${tabId}`
      : tabId;

    return createStackNavigator(screens, stackOptions || {}, stackConfig);
  });

  return new BottomTabsNavigator(stacks, options, config);
}

export function createOverlayNavigator(id, route) {
  return new OverlayNavigator(createComponent(id, route));
}

export function createSideMenuNavigator(screens, config = {}) {
  const routes = createComponents(screens);

  const { contentComponent, contentOptions = {} } = config;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  config.drawer = createComponent(contentComponent, contentOptions);

  return new SideMenuNavigator(routes, options, config);
}

export function createStackNavigator(screens, options = {}, config = {}) {
  const components = createComponents(screens);

  if (config.mode === 'modal') {
    return new ModalNavigator(components, options, config);
  }

  return new StackNavigator(components, options, config);
}

// TODO
// https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitchNavigator(navigators, options = {}, config = {}) {
  return new SwitchNavigator(navigators, options, config);
}

export function createWidget(id) {
  return new WidgetComponent(id);
}

export function setDefaultOptions(defaultOptions) {
  Navigation.events().registerAppLaunchedListener(() =>
    Navigation.setDefaultOptions(defaultOptions),
  );
}
