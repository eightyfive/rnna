import OverlayNavigator from './OverlayNavigator';
import { createRoutes } from './utils';

const o = {
  values: Object.values,
};

export default function createOverlayNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  if (o.values(routes).length > 1) {
    throw new Error('`OverlayNavigator` only accepts one `Component` child');
  }

  return new OverlayNavigator(routes, config);
}
