import BottomTabsNavigator from './BottomTabsNavigator';
import StackNavigator from './StackNavigator';
import { createRoutes } from './utils';

const o = {
  values: Object.values,
};

export default function createBottomTabsNavigator(routeConfigs, options = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = o
    .values(routes)
    .some(route => !(route instanceof StackNavigator));

  if (invalid) {
    throw new Error(
      '`BottomTabsNavigator` only accepts `StackNavigator` children',
    );
  }

  return new BottomTabsNavigator(routes, options);
}
