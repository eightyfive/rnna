import SwitchNavigator from './SwitchNavigator';
import { createRoutes, getSwitchNavigatorConfig } from './utils';

// TODO: https://reactnavigation.org/docs/en/switch-navigator.html
export default function createSwitchNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);
  const navigatorConfig = getSwitchNavigatorConfig(config);

  return new SwitchNavigator(routes, navigatorConfig);
}
