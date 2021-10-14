import _get from 'lodash.get';
import { denormalize } from 'normalizr';
import { singular } from 'pluralize';
import { createSelector as createReselector } from 'reselect';
import { createCachedSelector as createRereselector } from 're-reselect';

const getters = ['addTable', 'getState', 'setStore', 'store', '$'];
const setters = ['store'];

// Web Proxy
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
const proxyHandler = {
  get(target, key) {
    if (getters.includes(key)) {
      return target[key];
    }

    const selector = target.selectors[key];

    if (typeof selector === 'undefined') {
      throw new Error(`Selector \`${key}\` does not exist`);
    }

    return (...args) => selector(target.store.getState(), ...args);
  },

  set(target, key, val) {
    if (setters.includes(key)) {
      target[key] = val;

      return true;
    }

    if (typeof target.selectors[key] !== 'undefined') {
      throw new Error(`Selector \`${key}\` already exists`);
    }

    target.selectors[key] = val;

    return true;
  },
};

export default class Db {
  constructor() {
    this.selectors = new Map();
    this.store = null;

    return new Proxy(this, proxyHandler);
  }

  $(...slices) {
    const props = {};

    slices.forEach(path => {
      if (typeof path !== 'string') {
        throw new Error('State slice name must be a string');
      }

      const name = path.split('.').pop();

      props[name] = getSlice(path)(this.getState());
    });

    return props;
  }

  setStore(store) {
    this.store = store;
  }

  getState() {
    return this.store.getState();
  }

  addTable(schema) {
    // `schema.key` is plural by convention

    // Ex: users
    const names = schema.key;
    // Ex: user
    const name = singular(names);
    // Ex: Users
    const Names = capitalize(names);
    // Ex: User
    const Name = capitalize(name);

    // Set selectors on proxy target

    // Ex: `findUser`
    this[`find${Name}`] = createIdSelector(schema);
    // Ex: `getUsers`
    this[`get${Names}`] = createQuerySelector(schema);
  }
}

function createIdSelector(schema) {
  return createRereselector(
    (state, id) => id,
    state => state.db.tables,
    (id, entities) => denormalize(id, schema, entities),
  )((state, id) => id);
}

function createQuerySelector(schema) {
  return createRereselector(
    (state, query = {}) => query,
    state => state.db.queries,
    state => state.db.tables,
    (query, queries, entities) => {
      const result = queries[getQueryName(schema, query)] || [];

      return denormalize(result, [schema], entities);
    },
  )((state, query = {}) => getQueryName(schema, query));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getQueryName(schema, query) {
  return `${schema.key}?${qs(query)}`;
}

function qs(obj) {
  return Object.entries(obj)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
    )
    .join('&');
}

// getSlice
const cache = {
  slices: new Map(),
};

export function getSlice(path) {
  const { slices } = cache;

  if (!slices.has(path)) {
    slices.set(path, s => _get(s, path));
  }

  return slices.get(path);
}

// createSelector
export function createSelector(...paths) {
  const selector = paths.pop();

  if (!paths.length) {
    // `selector` is path
    // Ex: `createSelector('session.token')` => (state) => state.session.token;
    return getSlice(selector);
  }

  const slices = paths.map(path =>
    typeof path === 'string' || Array.isArray(path) ? getSlice(path) : path,
  );

  return createReselector(...slices, selector);
}

// createCachedSelector
export function createCachedSelector(...paths) {
  const selector = paths.pop();

  if (!paths.length) {
    // `selector` is path
    // Ex: `createCachedSelector('session.token')` => (state) => state.session.token;
    return getSlice(selector);
  }

  const slices = paths.map(path =>
    typeof path === 'string' || Array.isArray(path) ? getSlice(path) : path,
  );

  return createRereselector(...slices, selector);
}
