import { applyMiddleware, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';

import * as Config from '../../../app/config';

import rootEpic from '../../../app/events';
import rootReducer from '../../../app/state';

export default function create(services) {
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
  const reducer = persistReducer(Config.persist, rootReducer);

  // Store
  const store = createStore(reducer, applyMiddleware(...middlewares));

  // Configure services
  services.setStore(store);

  // Run epics
  epics.run(rootEpic);

  return store;
}
