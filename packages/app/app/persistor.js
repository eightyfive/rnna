import { persistStore } from 'redux-persist';

export default function getPersistor(store) {
  return new Promise(resolve => {
    const persistor = persistStore(store, null, function hydrated() {
      resolve(persistor);
    });
  });
}
