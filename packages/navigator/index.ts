import { Options } from 'react-native-navigation';

import { Component } from './Component';
import { Widget } from './Widget';
import { createComponents, registerScreen } from './utils';
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
} from './types';

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
    id,
    name,
    Object.assign({}, ScreenComponent.options, options),
  );
}

export function createComponent(id: string, name: string, options?: Options) {
  return new Component(id, name || id, options);
}

export function createWidget(name: string, options?: Options) {
  return new Widget(name, options);
}

export { registerScreen };

// export function registerRoutes(routes, Provider) {
//   const screens = flatten(routes);

//   for (const [id, ScreenComponent] of Object.entries(screens)) {
//     const isConfig = id.indexOf('.config.') !== -1;

//     if (!isConfig) {
//       const name = id.split('.').pop();

//       registerScreen(name, ScreenComponent, Provider);
//     }
//   }
// }
