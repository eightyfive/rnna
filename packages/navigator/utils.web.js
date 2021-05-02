import { AppRegistry } from 'react-native';
import _mapValues from 'lodash.mapvalues';

import Component from './Component';

export function createComponents(screens) {
  return _mapValues(screens, (Screen, id) => createComponent(id, Screen));
}

export function createComponent(id, Screen) {
  registerComponent(id, Screen);

  return new Component(id, Screen.options || {});
}

export function registerComponent(name, Screen) {
  AppRegistry.registerComponent(name, () => Screen);
}
