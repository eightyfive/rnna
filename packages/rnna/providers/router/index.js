import Bundle from '../../bundle';
import events from './events';
import createRouter from './factory';

class RouterBundle extends Bundle {
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

export default function bundleRouter(routes) {
  return new RouterBundle(routes);
}
