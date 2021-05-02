import { Navigation } from 'react-native-navigation';
import React from 'react';
import _mapValues from 'lodash.mapvalues';

import Component from './Component.native';

export function createComponents(screens) {
  return _mapValues(screens, (Screen, id) => createComponent(id, Screen));
}

export function createComponent(id, Screen) {
  registerComponent(id, Screen);

  return new Component(id, Screen.options || {});
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
