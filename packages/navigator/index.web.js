import SwitchNavigator from './SwitchNavigator';

import { createComponents } from './utils';

export function createSwitch(routes, options = {}, config = {}) {
  return new SwitchNavigator(createComponents(routes), options, config);
}
