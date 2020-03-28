import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';

import { persist as persistConfig } from './config';

import epic from './events';
import reducer from './state';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epics = createEpicMiddleware();

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  persistedReducer,
  /* preloadedState, */
  composeEnhancers(applyMiddleware(epics)),
);

const { dispatch } = store;

store.dispatch = (action, payload) => {
  if (typeof action === 'string') {
    // FSA
    return dispatch({ type: action, payload });
  }

  return dispatch(action);
};

epics.run(epic);

export default store;
