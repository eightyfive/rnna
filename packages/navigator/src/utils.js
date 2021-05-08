import Component from './Component';

export function createComponents(routes, parentId) {
  return Object.entries(routes).map(([componentName, ReactComponent]) => {
    const component = Component.register(
      parentId ? `${parentId}/${componentName}` : componentName,
      componentName,
      ReactComponent,
      ReactComponent.options || {},
    );

    return [componentName, component];
  });
}
