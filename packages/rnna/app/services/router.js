import Router from '@rnna/router';

export default function createRouter(routes, services) {
  const router = new Router(routes, services);

  return router;
}
