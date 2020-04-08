import SwitchNavigator from './SwitchNavigator';
import { createRoutes } from './utils';

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export default function createSwitchNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  return new SwitchNavigator(routes, config);
}
