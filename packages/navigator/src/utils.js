import Component from './Component';

export function createComponents(routes, parentId) {
  const components = {};

  Object.entries(routes).forEach(([componentName, ReactComponent]) => {
    const component = Component.register(
      parentId ? `${parentId}/${componentName}` : componentName,
      componentName,
      ReactComponent,
      ReactComponent.options || {},
    );

    components[componentName] = component;
  });

  return components;
}
