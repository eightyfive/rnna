import RootNavigator from './RootNavigator';
import Registry from './Registry';
import SwitchNavigator from './SwitchNavigator';
import * as Layouts from './Layouts';
import * as Utils from './utils';

export { Layouts, Registry, Utils };

export function createBottomTabs(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const stacks = {};

  Object.entries(routes).forEach(([name, config]) => {
    const { config: stackConfig = {}, ...components } = config;

    stackConfig.parentId = parentId ? `${parentId}/${name}` : name;

    stacks[name] = createStack(components, stackConfig);
  });

  return new Layouts.BottomTabs(stacks, restConfig);
}

export function createComponent(id, name, ReactComponent) {
  return Utils.createComponent(id, name, ReactComponent);
}

export function createStack(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = Utils.createComponents(routes, parentId);

  return new Layouts.Stack(components, restConfig);
}

export function createModal(routes, config = {}) {
  const { parentId, ...restConfig } = config;

  const components = Utils.createComponents(routes, parentId);

  return new Layouts.Modal(components, restConfig);
}

export function createWidget(name, ReactComponent) {
  const widget = new Layouts.Widget(name);

  Registry.register(widget.id, name, ReactComponent);

  return widget;
}

export function createRootNavigator(routes, config = {}) {
  const [layouts, modals, overlays] = Utils.createLayouts(routes);

  const root = new RootNavigator(layouts, config);

  modals.forEach((modal, name) => {
    root.addModal(name, modal);
  });

  overlays.forEach((overlay, name) => {
    root.addOverlay(name, overlay);
  });

  return root;
}

export function createSwitchNavigator(layouts, config = {}) {
  return new SwitchNavigator(layouts, config);
}
