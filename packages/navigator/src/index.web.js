import SwitchNavigator from './SwitchNavigator';

export { default as Registry } from './Registry';
import * as Utils from './utils';

export function createSwitchNavigator(routes, config = {}) {
  const components = Utils.createComponents(routes);

  return new SwitchNavigator(components, config);
}
