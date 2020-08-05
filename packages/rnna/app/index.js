import * as Config from '../../../app/config';
import routes from '../../../app/routes';
import services from '../../../app/services';

import createStore from './store';
import persistStore from './persistor';
import createApi from './services/api';
import createRouter from './services/router';

// API
const api = createApi(Config.api);

// Router (navigation)
const router = createRouter(services);

// Boot navigation (async)
const launched = router.boot(routes);

// Store
const store = createStore({ ...services, api, router }, Config.store);

// Persist store (async)
const persisted = persistStore(store);

export default {
  async boot() {
    await Promise.all([launched, persisted]);

    store.dispatch({ type: '[App] Booted' });
  },
};
