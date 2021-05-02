import Router from './Router';

export default function createRouter(routes, db) {
  const components = new Map(Object.entries(routes));

  return new Router(routes, components, { db });
}
