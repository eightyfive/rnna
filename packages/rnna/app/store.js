import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import events from './events';
import epics from '../../../app/epics';
import reducers from '../../../app/state';

const rootEpic = combineEpics(...events, ...epics);
const rootReducer = combineReducers(reducers);

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
