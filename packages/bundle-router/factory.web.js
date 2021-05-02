import Router from './Router';

export default function createRouter(routes, services) {
  return new Router(routes, services);
}
