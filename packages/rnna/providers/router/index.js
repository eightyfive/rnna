import Provider from '../../provider';
import events from './events';
import createRouter from './factory';

class RouterProvider extends Provider {
  constructor(routes) {
    super();

    this.routes = routes;
  }

  register(services, reducers, epics) {
    const router = createRouter(this.routes, services);

    Object.assign(services, { router });

    epics.unshift(...events);
  }
}

export default function createRouterProvider(routes) {
  return new RouterProvider(routes);
}
