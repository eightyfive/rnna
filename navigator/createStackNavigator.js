import Navigator from './Navigator';
import StackNavigator from './StackNavigator';
import { createRoutes } from './utils';

const o = {
  values: Object.values,
};

export default function createStackNavigator(routeConfigs, options = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = o.values(routes).some(route => route instanceof Navigator);

  if (invalid) {
    throw new Error('`StackNavigator` only accepts `Component` children');
  }

  return new StackNavigator(routes, options);
}
