import { createRouter } from '@rnna/navigator';

import * as Config from '../../../app/config';
import routes from '../../../app/routes';
import services from '../../../app/services';

import createStore from './store';
import persistStore from './persistor';
import createApi from './api';

// API
const api = createApi(Config.api);

// Router (navigation)
const router = createRouter(routes, services);

// Boot navigation (async)
const launched = router.launch();

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
