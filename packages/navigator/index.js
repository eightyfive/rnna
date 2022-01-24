import { Widget } from './Layouts';
import { createComponents, getRouteType, registerScreen } from './utils';
import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import StackNavigator from './StackNavigator';

export function createBottomTabsNavigator(routes, config = {}, Provider) {
  const { parentId, ...restConfig } = config;

  const stacks = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStackNavigator(components, stackConfig, Provider);
  });

  return new BottomTabsNavigator(stacks, restConfig);
}

export function createStackNavigator(routes, config = {}, Provider) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId, Provider);

  return new StackNavigator(components, restConfig);
}

export function createModalNavigator(routes, config = {}, Provider) {
  const { parentId, ...restConfig } = config;

  const components = createComponents(routes, parentId, Provider);

  return new ModalNavigator(components, restConfig);
}

export function createOverlayNavigator(
  id,
  name,
  ScreenComponent,
  options,
  Provider,
) {
  registerScreen(name, ScreenComponent, Provider);

  return new OverlayNavigator(
    id,
    name,
    Object.assign({}, ScreenComponent.options, options),
  );
}

export function createWidget(name, ScreenComponent, options, Provider) {
  registerScreen(name, ScreenComponent, Provider);

  return new Widget(name, options);
}

export function createRootNavigator(defs, Provider) {
  const navigators = {};

  Object.entries(defs).forEach(([name, def]) => {
    const type = getRouteType(def);

    if (type === 'overlay') {
      navigators[name] = createOverlayNavigator(name, name, def, Provider);
    } else {
      const { config = {}, ...routes } = def;

      config.parentId = name;

      switch (type) {
        case 'bottomTabs':
          navigators[name] = createBottomTabsNavigator(
            routes,
            config,
            Provider,
          );
          break;

        case 'modal':
          navigators[name] = createModalNavigator(routes, config, Provider);
          break;

        case 'stack':
          navigators[name] = createStackNavigator(routes, config, Provider);
          break;

        default:
          throw new Error(
            `Invalid route (too deep): ${JSON.stringify(def, null, 2)}`,
          );
      }
    }
  });

  return new RootNavigator(navigators);
}
