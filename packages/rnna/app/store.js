import { applyMiddleware, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';

import rootEpic from '../../../app/events';
import rootReducer from '../../../app/state';

export default function create(services, { persist: persistConfig }) {
  // Epics
  const epics = createEpicMiddleware({ dependencies: services });

  // Middlewares
  const middlewares = [epics];

  // Redux Flipper (DEV)
  if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
  }

  // Reducer
  const reducer = persistReducer(persistConfig, rootReducer);

  // Store
  const store = createStore(reducer, applyMiddleware(...middlewares));

  // Configure services
  if (services.setStore) {
    services.setStore(store);
  }

  // Run epics
  epics.run(rootEpic);

  return store;
}
