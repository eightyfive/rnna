import Provider from '../../provider';
import { onState$, go$ } from './events';
import createRouter from './factory';

class RouterProvider extends Provider {
  constructor(routes) {
    super();

    this.routes = routes;
  }

  register(services, reducers, epics) {
    const router = createRouter(this.routes, services);

    Object.assign(services, { router });

    epics.unshift(onState$);
    epics.push(go$);
  }
}

export default function createRouter(routes) {
  return new RouterProvider(routes);
}
