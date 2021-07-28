export default function createDb(selectors = {}) {
  let store;

  function setStore(val) {
    store = val;
  }

  // Web Proxy
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  const handler = {
    get(target, key) {
      if (key === 'setStore') {
        return setStore;
      }

      if (key === 'state') {
        return store.getState();
      }

      const selector = target[key];

      if (typeof selector === 'undefined') {
        throw new Error(`Selector \`${key}\` does not exist`);
      }

      return (...args) => selector(store.getState(), ...args);
    },

    set(target, key, val) {
      if (key === 'store') {
        throw new Error(`Use \`setStore\` method`);
      }

      if (typeof target[key] !== 'undefined') {
        throw new Error(`Selector \`${key}\` already exists`);
      }

      target[key] = val;

      return true;
    },
  };

  const target = Object.assign({}, selectors);

  return new Proxy(target, handler);
}
