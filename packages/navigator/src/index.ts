import { Options } from 'react-native-navigation';

import { Component } from './Component';
import { BottomTabs } from './BottomTabs';
import { Modal } from './Modal';
import { Overlay } from './Overlay';
import { Stack } from './Stack';
import {
  BottomTabsRoutes,
  BottomTabsConfig,
  StackRoutes,
  StackConfig,
  ScreenElement,
  ReactComponent,
} from './types';
import { Navigator } from './Navigator';
export { NavigatorProvider } from './NavigatorContext';
export { useNavigator } from './useNavigator';

export function createBottomTabs(
  routes: BottomTabsRoutes,
  config: BottomTabsConfig = {},
) {
  const { parentId, ...options } = config;

  const stacks: Record<string, Stack> = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStack(components, stackConfig);
  });

  return new BottomTabs(stacks, options);
}

export function createStack(routes: StackRoutes, config: StackConfig = {}) {
  const { parentId, ...options } = config;

  const components = createComponents(routes, parentId);

  return new Stack(components, options);
}

export function createModal(routes: StackRoutes, config: StackConfig = {}) {
  const { parentId, ...options } = config;

  const components = createComponents(routes, parentId);

  return new Modal(components, options);
}

export function createOverlay(
  id: string,
  name: string,
  ScreenComponent: ScreenElement,
  options?: Options,
) {
  return new Overlay(
    name,
    ScreenComponent,
    Object.assign({}, ScreenComponent.options, options),
  );
}

export function createComponent(
  name: string,
  ScreenComponent: ScreenElement,
  options?: Options,
) {
  return new Component(
    name,
    ScreenComponent,
    Object.assign({}, ScreenComponent.options, options),
  );
}

function createComponents(
  routes: Record<string, ScreenElement>,
  parentId?: string,
) {
  const components: Record<string, Component> = {};

  Object.entries(routes).forEach(([name, ScreenComponent]) => {
    components[name] = createComponent(name, ScreenComponent);
  });

  return components;
}

export function registerNavigator<T>(
  navigator: Navigator,
  Provider?: ReactComponent,
) {
  Object.values(navigator).forEach(layout => {
    layout.register(Provider);
  });
}
