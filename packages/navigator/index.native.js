import _mapValues from 'lodash.mapvalues';

import BottomTabsNavigator from './BottomTabsNavigator';
import Component from './Component.native';
import ModalNavigator from './ModalNavigator';
// import SideMenuNavigator from './SideMenuNavigator';
import StackNavigator from './StackNavigator';
import SwitchNavigator from './SwitchNavigator';
import OverlayNavigator from './OverlayNavigator';
import WidgetComponent from './WidgetComponent';

export function createBottomTabs(tabs, config = {}) {
  const bottomTabs = new BottomTabsNavigator(config);

  Object.entries(tabs).forEach(([tabName, tabConfig]) => {
    const { config: stackConfig = {}, ...screens } = tabConfig;

    stackConfig.parentId = tabName;

    const stack = createStack(screens, stackConfig);

    bottomTabs.addRoute(tabName, stack);
  });

  return bottomTabs;
}

export function createOverlay(componentName, OverlayComponent, config = {}) {
  const { parentId, ...restConfig } = config;

  const overlay = new OverlayNavigator(restConfig);

  const component = Component.register(
    componentName,
    OverlayComponent,
    config.options || {},
    parentId,
  );

  overlay.addRoute(component);

  return overlay;
}

export function createSideMenu(screens, config = {}) {
  // TODO
}

export function createStack(screens, config = {}) {
  const { parentId, ...restConfig } = config;

  const stack = new StackNavigator(restConfig);

  const components = createComponents(screens, parentId);

  components.forEach(([name, component]) => {
    stack.addRoute(name, component);
  });

  return stack;
}

export function createModal(screens, config = {}) {
  const { parentId, ...restConfig } = config;

  const modal = new ModalNavigator(restConfig);

  const components = createComponents(screens, parentId);

  components.forEach(([name, component]) => {
    modal.addRoute(name, component);
  });

  return modal;
}

export function createSwitch(navigators, config = {}) {
  const switchNavigator = new SwitchNavigator(config);

  Object.entries(navigators).forEach(([name, navigator]) => {
    switchNavigator.addRoute(name, navigator);
  });

  return switchNavigator;
}

export function createWidget(name, Widget) {
  return WidgetComponent.register(name, Widget);
}

function createComponents(screens, parentId) {
  return Object.entries(screens).map(([componentName, ScreenComponent]) => {
    const component = Component.register(
      componentName,
      ScreenComponent,
      ScreenComponent.options || {},
      parentId,
    );

    return [componentName, component];
  });
}
