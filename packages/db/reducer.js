import produce from 'immer';

const initialState = {
  tables: {},
  queries: {},
  pages: {},
};

export default produce((draft, { payload = {}, meta = {} }) => {
  const { result, entities } = payload;

  if (entities) {
    produceTables(draft.tables, entities);
  }

  if (Array.isArray(result) && meta.resource) {
    produceQuery(draft.queries, meta.resource, result, meta.query);

    const { page, ...rest } = meta.query || {};

    if (page) {
      producePage(draft.pages, meta.resource, result, rest, page);
    }
  }
}, initialState);

function produceTables(tables, entities) {
  for (const [name, byId] of Object.entries(entities)) {
    const exists = typeof tables[name] !== 'undefined';

    if (!exists) {
      tables[name] = {};
    }

    for (const [id, entity] of Object.entries(byId)) {
      if (tables[name][id]) {
        // Merge
        Object.assign(tables[name][id], entity);
      } else {
        // Set
        tables[name][id] = entity;
      }
    }
  }
}

function produceQuery(queries, resource, result, query = {}) {
  // users?
  // users?published=1&page=1
  const key = getQueryKey(resource, query);

  if (!queries[key]) {
    queries[key] = [];
  }

  const changed = compareArrays(result, queries[key]);

  if (changed) {
    queries[key] = result;
  }
}

function producePage(pages, resource, result, query = {}, page) {
  const key = getQueryKey(resource, query);

  if (!pages[key]) {
    pages[key] = [];
  }

  pages[key][page - 1] = result;

  const changed = compareArrays(result, pages[key]);

  if (changed) {
    pages[key][page - 1] = result;
  }
}

function qs(obj) {
  return Object.entries(obj)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
    )
    .join('&');
}

function getQueryKey(resource, query) {
  return `${resource}?${qs(query)}`;
}

function compareArrays(a, b) {
  return a.length !== b.length || a.some(id => !b.includes(id));
}
