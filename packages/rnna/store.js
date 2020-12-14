import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

const BOOT = { type: '[App] Boot' };

function isPersisted(persistor) {
  const { bootstrapped } = persistor.getState();

  return bootstrapped;
}

function getPersisted(persistor) {
  return new Promise(resolve => {
    const unsubscribe = persistor.subscribe(function handlePersistorState() {
      if (isPersisted(persistor)) {
        resolve();
        unsubscribe();
      }
    });
  });
}

export default function storeProvider(
  { epics, epic, middlewares = [], persist: persistConfig, reducers, reducer },
  services = {},
) {
  // Epics
  let rootEpic;
  let epicMiddleware;

  if (epic) {
    rootEpic = epic;
  } else if (epics) {
    rootEpic = combineEpics(...epics);
  }

  if (rootEpic) {
    epicMiddleware = createEpicMiddleware({ dependencies: services });
    middlewares.unshift(epicMiddleware);
  }

  // Store
  let rootReducer;

  if (reducer) {
    rootReducer = reducer;
  } else if (reducers) {
    rootReducer = combineReducers(reducers);
  } else {
    throw new Error('Either `reducers` or `reducer` config is required');
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, applyMiddleware(...middlewares));

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  const persistor = persistStore(store);

  const persisted = getPersisted(persistor);

  if (isPersisted(persistor)) {
    persisted.resolve();
  }

  // https://redux.js.org/api/api-reference#store-api
  const { getState, subscribe, replaceReducer } = store;

  // FSA dispatch
  function dispatch(action, payload) {
    if (typeof action === 'string') {
      return store.dispatch({ type: action, payload });
    }

    return store.dispatch(action);
  }

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
    //
    persistor,
    persist() {
      return persisted;
    },
    boot() {
      store.dispatch(BOOT);
    },
  };
}