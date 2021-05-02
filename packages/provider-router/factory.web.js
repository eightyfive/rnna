import Router from './Router';

export default function createRouter(routes, db) {
  return new Router(routes, { db });
}
