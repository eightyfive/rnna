import { AppRegistry } from 'react-native';

import Component from './Component';

export function createComponents(screens) {
  // TODO
  // return _mapValues(screens, (Screen, id) => createComponent(id, Screen));
}

export function createComponent(id, Screen) {
  registerComponent(id, Screen);

  return new Component(id, Screen.options || {});
}

export function registerComponent(name, Screen) {
  AppRegistry.registerComponent(name, () => Screen);
}
