import _get from 'lodash.get';
import _set from 'lodash.set';
import pluralize from 'pluralize';
import { createSelector as createReselectSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';

const o = Object;

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

// addTable
function addTable(table, relations = []) {
  // Ex: `table = "users"`
  const names = table; // `table` is plural by convention
  const name = pluralize.singular(names);
  const Name = ucfirst(name);
  const Names = ucfirst(names);

  // Ex: `findUser`
  const findSelector = createFindSelector(table);
  db[`find${Name}`] = findSelector;

  // Ex: `getUsers`
  db[`get${Names}`] = createGetSelector(table);

  for (let relation of relations) {
    const relationSelector = createRelationSelector(
      findSelector,
      pluralize.plural(relation), // plural table name by convention
      relation,
    );

    const Relation = ucfirst(relation); // plural or singular
    const isPlural = pluralize.isPlural(relation);

    if (isPlural) {
      // Ex: `getUserPosts`
      db[`get${Name}${Relation}`] = relationSelector;
    } else {
      // Ex: `findUserPost`
      db[`find${Name}${Relation}`] = relationSelector;
    }
  }
}

// createFindSelector
function createFindSelector(table) {
  return (state, id) => {
    const rows = _get(state, [...ns.tables, table]);

    return rows[id] || null;
  };
}

// createGetSelector
function createGetSelector(table) {
  return (state, order = 'default') => selectResult(state, table, order);
}

// selectResult
const selectTable = (state, table, order = 'default') => {
  return _get(state, [...ns.tables, table]);
};

const selectOrder = (state, table, order = 'default') => {
  return _get(state, [...ns.orders, table, order]);
};

const selectResult = createCachedSelector(
  selectTable,
  selectOrder,
  (rows, order) => {
    return order.map(id => rows[id]);
  },
)((state, table, order = 'default') => `${table}.${order}`);

// createRelationSelector
function createRelationSelector(findSelector, table, name) {
  return createSelector(findSelector, [...ns.tables, table], (row, related) => {
    const relation = row[name];

    if (Array.isArray(relation)) {
      // `relation` is an array of IDs here
      return relation.map(id => related[id]);
    }

    // `relation` is an ID here
    return related[relation];
  });
}

// getSlice
function getSlice(path) {
  const { slices } = cache;

  if (!slices.has(path)) {
    slices.set(path, st => _get(st, path));
  }

  return slices.get(path);
}

// createSelector
export function createSelector(...names) {
  const selector = names.pop();

  const slices = names.map(name =>
    typeof name === 'string' || Array.isArray(name) ? getSlice(name) : name,
  );

  if (!slices.length) {
    return createReselectSelector(getSlice(selector), s => s);
  }

  return createReselectSelector(...slices, selector);
}

// produceTables
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

// produceTableOrder
export function produceTableOrder(orders, table, name, result) {
  let order = _get(orders, [table, name], []);

  const changed =
    result.length !== order.length || result.some(id => !order.includes(id));

  if (changed) {
    _set(orders, [table, name], result);
  }
}

db.addTable = addTable;

export default db;
