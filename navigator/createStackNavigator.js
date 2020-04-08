import ModalNavigator from './ModalNavigator';
import Navigator from './Navigator';
import StackNavigator from './StackNavigator';
import { createRoutes, getStackNavigatorConfig } from './utils';

export default function createStackNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = Object.values(routes).some(
    route => route instanceof Navigator,
  );

  if (invalid) {
    throw new Error('`StackNavigator` only accepts `Component` children');
  }

  const navigatorConfig = getStackNavigatorConfig(config);

  if (navigatorConfig.mode === 'modal') {
    return new ModalNavigator(routes, navigatorConfig);
  }

  return new StackNavigator(routes, navigatorConfig);
}
