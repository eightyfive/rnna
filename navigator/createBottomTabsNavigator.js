import BottomTabsNavigator from './BottomTabsNavigator';
import StackNavigator from './StackNavigator';
import { createRoutes } from './utils';

export default function createBottomTabsNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = Object.values(routes).some(
    route => !(route instanceof StackNavigator),
  );

  if (invalid) {
    throw new Error(
      '`BottomTabsNavigator` only accepts `StackNavigator` children',
    );
  }

  return new BottomTabsNavigator(routes, config);
}
