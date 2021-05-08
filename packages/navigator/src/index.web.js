import SwitchNavigator from './SwitchNavigator';

export { default as Registry } from './Registry';
export { createComponents } from './index';

export function createSwitch(routes, config = {}) {
  const switchNavigator = new SwitchNavigator(config);

  const components = createComponents(routes);

  components.forEach(([name, navigator]) => {
    switchNavigator.addRoute(name, navigator);
  });

  return switchNavigator;
}
