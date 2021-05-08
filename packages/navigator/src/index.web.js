import SwitchNavigator from './SwitchNavigator';
import * as Utils from './utils';

export { default as Registry } from './Registry';

export function createSwitchNavigator(routes, config = {}) {
  const components = Utils.createComponents(routes);

  return new SwitchNavigator(components, config);
}
