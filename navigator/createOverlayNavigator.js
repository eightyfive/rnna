import OverlayNavigator from './OverlayNavigator';
import { createRoutes } from './utils';

export default function createOverlayNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  if (Object.values(routes).length > 1) {
    throw new Error('`OverlayNavigator` only accepts one `Component` child');
  }

  return new OverlayNavigator(routes, config);
}
