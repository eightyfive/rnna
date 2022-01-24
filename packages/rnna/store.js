import {
  applyMiddleware,
  combineReducers,
  createStore as createReduxStore,
} from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

export const BOOT = 'app/boot';

function isHydrated(persistor) {
  const { bootstrapped } = persistor.getState();

  return bootstrapped;
}

function getHydratedAsync(persistor) {
  if (isHydrated(persistor)) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const unsubscribe = persistor.subscribe(function handlePersistorState() {
      if (isHydrated(persistor)) {
        resolve();
        unsubscribe();
      }
    });
  });
}

export default function createStore(
  { epics = [], middlewares = [], persist: persistConfig, reducers = {} },
  container,
) {
  const bundles = Object.values(container.services['bundles.*']);

  // Register bundles
  bundles.map(bundle => {
    Object.assign(reducers, bundle.getReducers());

    epics.push(...bundle.getEpics());

    bundle.register(container);
  });

  // Epics
  let rootEpic;
  let epicMiddleware;

  if (epics.length) {
    rootEpic = combineEpics(...epics);
    epicMiddleware = createEpicMiddleware({ dependencies: container.services });

    middlewares.unshift(epicMiddleware);
  }

  // Store
  const rootReducer = combineReducers(reducers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

  const store = createReduxStore(persistedReducer, enhancer);

  // Persistor
  store.persistor = persistStore(store);

  const hydrated = getHydratedAsync(store.persistor);

  // Boot
  store.boot = () => hydrated.then(() => store.dispatch({ type: BOOT }));

  // Boot bundles
  bundles.map(bundle => {
    bundle.boot(container.services, store);
  });

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  return store;
}
