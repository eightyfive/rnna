import SwitchNavigator from './SwitchNavigator';

import { createComponents } from './utils';

export function createSwitchNavigator(routes, options = {}, config = {}) {
  return new SwitchNavigator(createComponents(routes), options, config);
}
