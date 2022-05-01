import { Options } from 'react-native-navigation';

import { Component } from './Component';
import { Widget } from './Widget';
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
import { registerComponent } from './registerComponent';

export function createBottomTabs(
  routes: BottomTabsRoutes,
  config: BottomTabsConfig = {},
) {
  const { parentId, Provider, ...options } = config;

  const stacks: Record<string, Stack> = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;
    stackConfig.Provider = Provider;

    stacks[name] = createStack(components, stackConfig);
  });

  return new BottomTabs(stacks, options);
}

export function createStack(routes: StackRoutes, config: StackConfig = {}) {
  const { parentId, Provider, ...options } = config;

  const components = createComponents(routes, parentId, Provider);

  return new Stack(components, options);
}

export function createModal(routes: StackRoutes, config: StackConfig = {}) {
  const { parentId, Provider, ...options } = config;

  const components = createComponents(routes, parentId, Provider);

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

export function createComponent(
  id: string,
  name: string,
  ScreenComponent: ScreenElement,
  Provider?: ReactComponent,
) {
  registerComponent(name, ScreenComponent, Provider);

  return new Component(id, name, ScreenComponent.options);
}

function createComponents(
  routes: Record<string, ScreenElement>,
  parentId?: string,
  Provider?: ReactComponent,
) {
  const components: Record<string, Component> = {};

  Object.entries(routes).forEach(([name, ScreenComponent]) => {
    const id = parentId ? `${parentId}/${name}` : name;

    components[name] = createComponent(id, name, ScreenComponent, Provider);
  });

  return components;
}
