import { createRouter } from '@rnna/navigator';

export default function routerProvider(routes, services = null) {
  const router = createRouter(routes);

  if (services) {
    router.inject(services);
  }

  return router;
}
