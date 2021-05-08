import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import StackNavigator from './StackNavigator';
import RootNavigator from './RootNavigator';
import SwitchNavigator from './SwitchNavigator';
import WidgetComponent from './WidgetComponent';
import * as Utils from './utils';
import { BottomTabs, Modal, Overlay, Stack } from './Layouts';

export { default as Registry } from './Registry';

export function createBottomTabs(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const stacks = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStack(components, stackConfig);
  });

  return new BottomTabs(stacks, restConfig);
}

export function createComponent(id, name, ReactComponent) {
  return Utils.createComponent(id, name, ReactComponent);
}

export function createStack(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = Utils.createComponents(routes, parentId);

  return new Stack(components, restConfig);
}

export function createModal(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = Utils.createComponents(routes, parentId);

  return new Modal(components, restConfig);
}

export function createWidget(name, Widget) {
  return WidgetComponent.register(name, Widget);
}

export function createBottomTabsNavigator(routes, config = {}) {
  const bottomTabs = createBottomTabs(routes, config);

  return new BottomTabsNavigator(bottomTabs);
}

export function createModalNavigator(routes, config = {}) {
  const modal = createModal(routes, config);

  return new ModalNavigator(modal);
}

export function createStackNavigator(routes, config = {}) {
  const stack = createStack(routes, config);

  return new StackNavigator(stack);
}

export function createRootNavigator(routes, config = {}) {
  const layouts = {};

  const modals = new Map();
  const overlays = new Map();

  Object.entries(routes).forEach(([name, route]) => {
    const type = Utils.getRouteType(route);

    if (type === 'overlay') {
      overlays.set(name, new Overlay(name, name, route));
    } else {
      const { config: layoutConfig = {}, ...nestedRoutes } = route;

      layoutConfig.parentId = name;

      if (type === 'bottomTabs') {
        layouts[name] = createBottomTabs(nestedRoutes, layoutConfig);
      } else if (type === 'stack') {
        layouts[name] = createStack(nestedRoutes, layoutConfig);
      } else if (type === 'modal') {
        modals.set(name, createModal(nestedRoutes, layoutConfig));
      } else {
        throw new Error(
          `Invalid route (too deep): ${JSON.stringify(route, null, 2)}`,
        );
      }
    }
  });

  const root = new RootNavigator(layouts, config);

  modals.forEach((modal, name) => {
    root.addModal(name, modal);
  });

  overlays.forEach((overlay, name) => {
    root.addOverlay(name, overlay);
  });

  return root;
}

export function createSwitchNavigator(layouts, config = {}) {
  return new SwitchNavigator(layouts, config);
}
