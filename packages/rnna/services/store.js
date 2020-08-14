import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

function getPersistor(store) {
  return new Promise(resolve => {
    const persistor = persistStore(store, null, function hydrated() {
      resolve(persistor);
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
    middlewares.push(epicMiddleware);
  }

  // Redux Flipper (DEV)
  if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
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

  const reducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(reducer, applyMiddleware(...middlewares));

  // Configure services
  if (services.setStore) {
    services.setStore(store);
  }

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  const persistor = getPersistor(store);

  return [store, persistor];
}
