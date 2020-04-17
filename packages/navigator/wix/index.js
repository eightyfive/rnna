import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import Navigator from './Navigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';

import { createRoutes } from '../utils';

const o = {
  values: Object.values,
};

export function createBottomTabsNavigator(routeConfigs, options = {}) {
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

export function createModalNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = o.values(routes).some(route => route instanceof Navigator);

  if (invalid) {
    throw new Error('`ModalNavigator` only accepts `Component` children');
  }

  return new ModalNavigator(routes, config);
}

export function createOverlayNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  if (o.values(routes).length > 1) {
    throw new Error('`OverlayNavigator` only accepts one `Component` child');
  }

  return new OverlayNavigator(routes, config);
}

export function createStackNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = o.values(routes).some(route => route instanceof Navigator);

  if (invalid) {
    throw new Error('`StackNavigator` only accepts `Component` children');
  }

  return new StackNavigator(routes, config);
}
