import _get from 'lodash.get';
import _set from 'lodash.set';
import pluralize from 'pluralize';
import shallowEqual from 'shallowequal';
import {
  defaultMemoize,
  createSelector as reselect,
  createSelectorCreator,
} from 'reselect';

const o = {
  assign: Object.assign,
  entries: Object.entries,
  keys: Object.keys,
};

const createShallowSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual,
);

// Credits: https://stackoverflow.com/a/1026087/925307
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Options
const ns = {
  tables: ['db', 'tables'],
  orders: ['db', 'orders'],
};

const options = {
  namespaces: ns,
  reRelation: [/_id$/, ''],
};

const db = {
  options,
};

// Cache
const cache = {
  slices: new Map(),
  selectors: new Map(),
};

/**
 * Latest `state`
 *
 * @param {String} table: Table name
 */
let state = {};

/**
 * Sync `state`
 *
 * @param {Object} state: new `state`
 */
function sync(newState) {
  state = newState;
}

/**
 * @see addTable
 *
 * @param {String[]} names: Table names
 */
function addTables(names) {
  for (const name of names) {
    addTable(name);
  }
}

/**
 * Generates: find, getResult, findRelation & getRelations methods
 *
 * @param {String} name: Table name
 */
function addTable(name) {
  // find
  o.assign(db, createFind(name));

  // getResult
  o.assign(db, createResult(name));

  // findRelation
  o.assign(db, createRelation(name));

  // getRelations
  o.assign(db, createRelations(name));
}

/**
 * Creates "Find" db method (Ex: db.findUser(id))
 *
 * @param {String} table: Table name
 */
function createFind(table) {
  const singular = pluralize.singular(table);

  const methodName = `find${ucfirst(singular)}`;
  const method = id => findRow(table, id);

  return { [methodName]: method };
}

/**
 * Finds row in Table
 *
 * @param {String} name: Table name
 * @param {Number} id: Row ID
 * @param {Boolean} strict: "To throw or not to throw"...
 */
function findRow(name, id) {
  const table = _get(state, [...ns.tables, name]);

  if (!table) {
    throw new Error(`Table "${name}" does not exist`);
  }

  return table[id] || null;
}

/**
 * Creates "Get result" db method (Ex: db.getUsers("order_name"))
 *
 * @param {String} table: Table name
 */
function createResult(table) {
  const methodName = `get${ucfirst(table)}`;
  const method = result => getResult(table, result);

  return { [methodName]: method };
}

/**
 * Creates a selector for a given "order" result name
 *
 * @param {String} table: Table name
 * @param {String} order: Order name (Ex: "default" = [1, 2, 3] or "by_name" = [2, 3, 1])
 */
function getResult(table, order = 'default') {
  const selector = getResultSelector(table, order);

  return selector(state);
}

function getResultSelector(table, order) {
  const { selectors } = cache;

  if (!selectors.has(order)) {
    selectors.set(
      order,
      createResultSelector([...ns.tables, table], [...ns.orders, table, order]),
    );
  }

  return selectors.get(order);
}

export function createResultSelector(table, order) {
  const selector = createSelector(table, order, (byId, result) =>
    (result || []).map(id => byId[id]),
  );

  return createShallowSelector(selector, objs => objs);
}

/**
 * Creates "Has one" relation method (Ex: db.findUserRelation(id, "image"))
 *
 * @param {String} table: Table name
 */
function createRelation(table) {
  const singular = pluralize.singular(table);

  const methodName = `find${ucfirst(singular)}Relation`;
  const method = (id, foreign, relations) =>
    findRelation(table, id, foreign, relations);

  return { [methodName]: method };
}

/**
 * Finds "Has one" relation
 *
 * @param {String} table: Table name
 * @param {Number} id: Row ID
 * @param {String} foreign: Foreign key in Row[ID] (Ex: "image")
 * @param {String} relations: Relation table name (Ex: "images")
 */

function findRelation(table, id, foreign, relations = null) {
  const row = findRow(table, id);

  const relationId = row[foreign];

  if (!relations) {
    relations = pluralize.plural(foreign.replace(...options.reRelation));
  }

  return findRow(relations, relationId);
}

/**
 * Creates "Has many" relation method (Ex: db.getUserRelation(id, "images"))
 *
 * @param {String} table: Table name
 */
function createRelations(table) {
  const singular = pluralize.singular(table);

  const methodName = `get${ucfirst(singular)}Relations`;
  const method = (id, foreign, relations) =>
    getRelations(table, id, foreign, relations);

  return { [methodName]: method };
}

/**
 * Gets "Has many" relation
 *
 * @param {String} table: Table name
 * @param {Number} id: Row ID
 * @param {String} foreign: Foreign key in Row[ID] (Ex: "images")
 * @param {String} relations: Relation table name (Ex: "images")
 */
function getRelations(table, id, foreign, relations = null) {
  if (!relations) {
    relations = foreign;
  }

  const selector = getRelationsSelector(table, id, foreign, relations);

  return selector(state);
}

function getRelationsSelector(table, id, foreign, relations) {
  const { selectors } = cache;
  const cacheKey = `${table}.${id}.${foreign}`;

  if (!selectors.has(cacheKey)) {
    selectors.set(
      cacheKey,
      createRelationsSelector([...ns.tables, table], id, foreign, relations),
    );
  }

  return selectors.get(cacheKey);
}

export function createRelationsSelector(table, id, foreign, relations) {
  const selector = createSelector(
    [...ns.tables, table, id, foreign],
    [...ns.tables, relations],
    (relation, byId) => relation.map(rId => byId[rId]),
  );

  return createShallowSelector(selector, objs => objs);
}

/**
 * Gets a `state` slice
 *
 * Returns: state => _.get(state, "some.deep[0].name"))
 *
 * @param {String} path: Slice path (Ex: "db.users", "session.token"...)
 */
function getSlice(path) {
  const { slices } = cache;

  if (!slices.has(path)) {
    slices.set(path, st => _get(st, path));
  }

  return slices.get(path);
}

/**
 * Wrapper around `reselect` createSelector that uses `getSlice`
 *
 * @param {...String} names: Slices of `state`
 */
export function createSelector(...names) {
  const selector = names.pop();

  const slices = names.map(name =>
    typeof name === 'string' || Array.isArray(name) ? getSlice(name) : name,
  );

  if (!slices.length) {
    return reselect(getSlice(selector), s => s);
  }

  return reselect(...slices, selector);
}

export function produceTables(tables, entities, strict = false) {
  for (const [name, rows] of o.entries(entities)) {
    const exists = typeof tables[name] !== 'undefined';

    if (strict && !exists) {
      throw new Error(`Entities "${name}" do not exist`);
    }

    if (!strict && !exists) {
      tables[name] = {};
    }

    for (const [id, row] of o.entries(rows)) {
      if (tables[name][id]) {
        // Merge
        o.assign(tables[name][id], row);
      } else {
        // Set
        tables[name][id] = row;
      }
    }
  }
}

db.sync = sync;
db.addTables = addTables;

export default db;
