import DrawerNavigator from './DrawerNavigator';
import {
  createRoutes,
  createComponent,
  getComponentOptions,
  getDrawerNavigatorConfig,
} from './utils';

export default function createDrawerNavigator(routeConfigs, config = {}) {
  const navigatorConfig = getDrawerNavigatorConfig(config);

  const { contentComponent, contentOptions = {} } = navigatorConfig;

  if (!contentComponent) {
    throw new Error('config.contentComponent is required');
  }

  // TODO
  navigatorConfig.drawer = createComponent(
    contentComponent,
    getComponentOptions(contentOptions),
  );

  const routes = createRoutes(routeConfigs);

  return new DrawerNavigator(routes, navigatorConfig);
}
