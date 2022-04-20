import React from 'react';
import { Navigation } from 'react-native-navigation';

import { Component } from './Component';
import { Props } from './Layout';
import { ReactComponent, ScreenElement } from './types';

export function registerScreen(
  name: string,
  ScreenComponent: ScreenElement,
  Provider: ReactComponent,
) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => (props: Props = {}) => (
        <Provider>
          <ScreenComponent {...props} />
        </Provider>
      ),
      () => ScreenComponent,
    );
  } else {
    Navigation.registerComponent(name, () => ScreenComponent);
  }
}

export function createComponents(
  routes: Record<string, ScreenElement>,
  parentId?: string,
) {
  const components: Record<string, Component> = {};

  Object.entries(routes).forEach(([name, ScreenComponent]) => {
    const id = parentId ? `${parentId}/${name}` : name;

    components[name] = new Component(
      id,
      name,
      Object.assign({}, ScreenComponent.options),
    );
  });

  return components;
}
