import Bundle from '../../bundle';
import events from './events';
import createRouter from './factory';

class RouterBundle extends Bundle {
  constructor(routes) {
    super();

    this.routes = routes;
    this.router = null;
  }

  register(services, reducers, epics) {
    this.router = createRouter(this.routes, services);

    Object.assign(services, { router: this.router });

    epics.unshift(...events);
  }

  boot(store) {
    // FSA dispatch
    function dispatch(action, payload) {
      if (typeof action === 'string') {
        return store.dispatch({ type: action, payload });
      }

      return store.dispatch(action);
    }

    this.router.addGlobalProp('dispatch', dispatch);
  }
}

export default function bundleRouter(routes) {
  return new RouterBundle(routes);
}
