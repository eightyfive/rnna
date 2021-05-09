import Registry from './Registry';
import SwitchNavigator from './SwitchNavigator';
import * as Layouts from './Layouts';
import * as Utils from './utils';

export { Layouts, Registry, SwitchNavigator, Utils };

export function createSwitchNavigator(routes, config = {}) {
  const components = Utils.createComponents(routes);

  return new SwitchNavigator(components, config);
}
