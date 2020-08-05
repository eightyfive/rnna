import Router from '@rnna/router';

export default function createRouter(services) {
  const router = new Router();

  router.inject('db', services.db);
  router.inject('dispatch', services.dispatch);

  return router;
}
