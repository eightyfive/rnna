import DrawerNavigator from './DrawerNavigator';
import { createRoutes, createComponent } from './utils';

export default function createDrawerNavigator(routeConfigs, config = {}) {
  const { contentComponent, contentOptions = {} } = config;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  config.drawer = createComponent(contentComponent, contentOptions);

  const routes = createRoutes(routeConfigs);

  return new DrawerNavigator(routes, config);
}
