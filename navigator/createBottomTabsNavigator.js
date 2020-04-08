import BottomTabsNavigator from './BottomTabsNavigator';
import StackNavigator from './StackNavigator';
import { createRoutes, getBottomTabNavigatorConfig } from './utils';

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

  const navigatorConfig = getBottomTabNavigatorConfig(config);

  return new BottomTabsNavigator(routes, navigatorConfig);
}
