import Navigator from './Navigator';
import StackNavigator from './StackNavigator';
import { createRoutes } from './utils';

export default function createStackNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = Object.values(routes).some(
    route => route instanceof Navigator,
  );

  if (invalid) {
    throw new Error('`StackNavigator` only accepts `Component` children');
  }

  return new StackNavigator(routes, config);
}
