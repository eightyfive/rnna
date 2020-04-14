import Navigator from './Navigator';
import ModalNavigator from './ModalNavigator';
import { createRoutes } from './utils';

const o = {
  values: Object.values,
};

export default function createModalNavigator(routeConfigs, config = {}) {
  const routes = createRoutes(routeConfigs);

  const invalid = o.values(routes).some(route => route instanceof Navigator);

  if (invalid) {
    throw new Error('`ModalNavigator` only accepts `Component` children');
  }

  return new ModalNavigator(routes, config);
}
