import SwitchNavigator from './SwitchNavigator';

export { default as Registry } from './Registry';

import { createComponents } from './utils';

export function createSwitch(routes, options = {}, config = {}) {
  return new SwitchNavigator(createComponents(routes), options, config);
}
