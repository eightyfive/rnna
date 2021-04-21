import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

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

export default function getStore(
  {
    epics = [],
    middlewares = [],
    persist: persistConfig,
    reducers = {},
    bundles = [],
  },
  services = {},
) {
  // Register bundles
  bundles.forEach(bundle => {
    bundle.register(services, reducers, epics);
  });

  // Epics
  let rootEpic;
  let epicMiddleware;

  if (epics.length) {
    rootEpic = combineEpics(...epics);
    epicMiddleware = createEpicMiddleware({ dependencies: services });

    middlewares.unshift(epicMiddleware);
  }

  // Store
  const rootReducer = combineReducers(reducers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, applyMiddleware(...middlewares));

  // Boot bundles
  bundles.forEach(bundle => {
    bundle.boot(store);
  });

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  const persistor = persistStore(store);

  const whenHydrated = getHydratedAsync(persistor);

  // https://redux.js.org/api/api-reference#store-api
  const { dispatch, getState, subscribe, replaceReducer } = store;

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
    //
    persistor,
    hydrate() {
      return whenHydrated;
    },
  };
}
