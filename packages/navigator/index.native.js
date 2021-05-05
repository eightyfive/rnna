import _mapValues from 'lodash.mapvalues';

import BottomTabsNavigator from './BottomTabsNavigator';
import Component from './Component.native';
import ModalNavigator from './ModalNavigator';
import SideMenuNavigator from './SideMenuNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import OverlayNavigator from './OverlayNavigator';
import WidgetComponent from './WidgetComponent';

import { createComponents, createComponent } from './utils.native';

export { default as registerComponents } from './registerComponents';

export function createBottomTabs(tabs, options = {}, config = {}) {
  const stacks = _mapValues(tabs, (tab, tabId) => {
    const {
      options: stackOptions = {},
      config: stackConfig = {},
      ...screens
    } = tab;

    stackConfig.parentId = config.parentId
      ? `${config.parentId}/${tabId}`
      : tabId;

    return createStack(screens, stackOptions || {}, stackConfig);
  });

  return new BottomTabsNavigator(stacks, options, config);
}

export function createOverlay(id, route) {
  return new OverlayNavigator(createComponent(id, route));
}

export function createSideMenu(screens, config = {}) {
  const routes = createComponents(screens);

  const { contentComponent, contentOptions = {} } = config;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  config.drawer = createComponent(contentComponent, contentOptions);

  return new SideMenuNavigator(routes, options, config);
}

export function createStack(screens, config = {}) {
  let stack;

  const { parentId, mode, ...restConfig } = config;

  if (mode === 'modal') {
    stack = new ModalNavigator(restConfig);
  } else {
    stack = new StackNavigator(restConfig);
  }

  Object.entries(screens).forEach(([componentName, Screen]) => {
    const componentId = parentId
      ? `${parentId}/${componentName}`
      : componentName;

    const component = Component.register(
      Screen,
      componentId,
      componentName,
      Screen.options || {},
    );

    stack.addRoute(componentName, component);
  });

  return stack;
}

export function createModal(screens, config = {}) {
  config.mode = 'modal';

  return createStack(screens, config);
}

// TODO
// https://reactnavigation.org/docs/en/switch-navigator.html
export function createSwitch(navigators, options = {}, config = {}) {
  return new SwitchNavigator(navigators, options, config);
}

export function createWidget(id) {
  return new WidgetComponent(id);
}
