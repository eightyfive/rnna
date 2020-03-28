import { Provider } from 'react-redux';

import { navigator } from './services';
import * as screens from './controllers';
import persistStore from './persistor';
import store from './store';

// Persist store (async)
const persisted = persistStore(store);

// Navigation
navigator.onAppMounted(() =>
  persisted.then(() => store.dispatch('[App] Storage synched')),
);

navigator.run(screens, Provider, store);
