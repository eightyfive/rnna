import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

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

export default async function getStore(
  {
    epics = [],
    middlewares = [],
    persist: persistConfig,
    reducers = {},
    bundles = [],
  },
  container,
) {
  let jobs;

  // Register bundles
  jobs = bundles.map(bundle => {
    Object.assign(reducers, bundle.getReducers());

    epics.push(...bundle.getEpics());

    return bundle.register(container);
  });

  await Promise.all(jobs);

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

  const store = createStore(persistedReducer, enhancer);

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

  // Boot bundles
  jobs = bundles.map(bundle => bundle.boot(container.services, store));

  await Promise.all(jobs);

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  return whenHydrated;
}
