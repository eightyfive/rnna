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
    providers = [],
    bundles = [],
  },
  container,
) {
  // Register bundles
  bundles.forEach(bundle => {
    providers.push(bundle.getServiceProvider());

    Object.assign(reducers, bundle.getReducers());

    epics.push(...bundle.getEpics());
  });

  // Register service providers
  providers.forEach(provider => provider.register(container));

  const services = container.container;

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

  // Boot service providers
  providers.forEach(provider => provider.boot(services, store));

  // Persistor
  const persistor = persistStore(store);

  const whenHydrated = getHydratedAsync(persistor);

  // "Enhance" store
  const storeDispatch = store.dispatch;

  // FSA dispatch
  store.dispatch = (action, payload) => {
    if (typeof action === 'string') {
      return storeDispatch({ type: action, payload });
    }

    return storeDispatch(action);
  };

  store.persistor = persistor;
  store.hydrate = () => whenHydrated;

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  return store;
}
