import Router from './Router';

export default function createRouter(routes, db) {
  const components = new Map();

  for (const [componentId, Component] of Object.entries(routes)) {
    components.set(componentId, Component);
  }

  return new Router(routes, components, { db });
}
