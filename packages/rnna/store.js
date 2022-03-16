import { applyMiddleware, combineReducers, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore(
  { epics = [], middlewares = [], reducers = {} },
  container,
) {
  const bundles = container.getBundles();

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

  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(rootReducer, enhancer);

  // Boot bundles
  bundles.map(bundle => {
    bundle.boot(container.services, store);
  });

  // Run epics
  if (epicMiddleware) {
    epicMiddleware.run(rootEpic);
  }

  store.boot = () => store.dispatch({ type: 'app/boot' });

  return store;
}
