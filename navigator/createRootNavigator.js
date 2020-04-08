import RootNavigator from './RootNavigator';
import { getRouteDepth } from './utils';
import createBottomTabsNavigator from './createBottomTabsNavigator';
import createOverlayNavigator from './createOverlayNavigator';
import createStackNavigator from './createStackNavigator';

export default function createRootNavigator(routes) {
  const app = {};

  for (const [k1, v1] of Object.entries(routes)) {
    const depth = getRouteDepth(v1);
    const { options, ...routeConfigs } = v1;

    if (depth === 2) {
      const stacks = {};

      for (const [k2, v2] of Object.entries(routeConfigs)) {
        stacks[k2] = createStackNavigator(v2);
      }

      app[k1] = createBottomTabsNavigator(stacks, options);
    } else if (depth === 1) {
      app[k1] = createStackNavigator(routeConfigs, options);
    } else if (depth === 0) {
      app[k1] = createOverlayNavigator(routeConfigs, options);
    } else {
      throw new Error('Invalid routes obj');
    }
  }

  return new RootNavigator(app);
}
