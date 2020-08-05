import services from '../../../app/services';
import createStore from './store';
import persistStore from './persistor';

import routes from '../../../app/routes';

// Boot navigation (async)
const launched = services.router.boot(routes);

// Store
const store = createStore(services);

// Persist store (async)
const persisted = persistStore(store);

export default {
  async boot() {
    await Promise.all([launched, persisted]);

    store.dispatch({ type: '[App] Booted' });
  },
};
