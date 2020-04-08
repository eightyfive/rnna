import RootNavigator from './RootNavigator';
import { getRouteDepth } from './utils';
import createBottomTabsNavigator from './createBottomTabsNavigator';
import createOverlayNavigator from './createOverlayNavigator';
import createStackNavigator from './createStackNavigator';

export default function createRootNavigator(routes) {
  const app = {};

  for (const [name, route] of Object.entries(routes)) {
    const depth = getRouteDepth(route);
    const { options, ...routeConfigs } = route;

    if (depth === 2) {
      app[name] = createBottomTabsNavigator(
        createStacks(routeConfigs),
        options,
      );
    } else if (depth === 1) {
      app[name] = createStackNavigator(routeConfigs, options);
    } else if (depth === 0) {
      app[name] = createOverlayNavigator(routeConfigs, options);
    } else {
      throw new Error('Invalid routes obj');
    }
  }

  return new RootNavigator(app);
}

function createStacks(routes) {
  const stacks = {};

  for (const [name, route] of Object.entries(routes)) {
    const { options, defaultOptions, ...routeConfigs } = route;
    stacks[name] = createStackNavigator(routeConfigs, {
      options,
      defaultOptions,
    });
  }

  return stacks;
}
