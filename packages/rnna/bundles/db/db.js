let state;

function setState(val) {
  state = val;
}

function getState() {
  return state;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
const handler = {
  get(target, key) {
    if (key === 'setState') {
      return setState;
    }

    if (key === 'state') {
      return getState();
    }

    const selector = target[key];

    if (typeof selector === 'undefined') {
      throw new Error(`Selector \`${key}\` does not exist`);
    }

    return (...args) => selector(getState(), ...args);
  },

  set(target, key, val) {
    if (key === 'state') {
      throw new Error(`Use \`setState\` method`);
    }

    if (typeof target[key] !== 'undefined') {
      throw new Error(`Selector \`${key}\` already exists`);
    }

    target[key] = val;

    return true;
  },
};

const target = {};

export default new Proxy(target, handler);
