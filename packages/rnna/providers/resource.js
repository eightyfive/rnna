import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import plural from 'pluralize';

import Provider from '../provider';

const { singular } = plural;

class ResourceProvider extends Provider {
  constructor(endpoint, entitySchema) {
    this.name = entitySchema.key;
    this.endpoint = endpoint;
    this.schema = entitySchema;
    this.relations = Object.values(entitySchema.schema).map(schema =>
      Array.isArray(schema) ? schema[0].key : schema.key,
    );
  }

  register(services, reducers, epics) {
    // Services
    Object.assign(services, {
      [this.name]: new Resource(services.api, this.schema.key, this.endpoint),
    });

    // Reducers
    Object.assign(reducers, {
      [this.name]: createReducer(this.schema.key),
    });

    // Selectors
    const Name = ucfirst(singular(this.name));
    const Names = ucfirst(plural(this.name));

    Object.assign(services.db, {
      [`find${Name}`]: createFind(this.schema, this.relations),
      [`get${Names}`]: createGet(this.schema, this.relations),
    });
  }
}

class Resource {
  constructor(http, key, endpoint) {
    this.http = http;
    this.endpoint = endpoint;
    this.key = key;
  }

  // CRUD: CREATE
  create(data) {
    return this.http.post(this.endpoint, data).pipe(
      map(action => {
        const { res } = action.meta;

        if (!res) {
          return { ...action, type: `${this.key}/creating` };
        }

        if (res.status === 200) {
          return { ...action, type: `${this.key}/created` };
        }

        // Err
        return action;
      }),
    );
  }

  // CRUD: READ
  read(id) {
    return this.http.get(`${this.endpoint}/${id}`).pipe(
      map(action => {
        const { res } = action.meta;

        if (!res) {
          return { ...action, type: `${this.key}/reading`, payload: id };
        }

        if (res.status === 200) {
          return { ...action, type: `${this.key}/read` };
        }

        // Err
        return action;
      }),
    );
  }

  // CRUD: UPDATE
  update(id, data) {
    return this.http.put(`${this.endpoint}/${id}`, data).pipe(
      map(action => {
        const { res } = action.meta;

        if (!res) {
          return { ...action, type: `${this.key}/updating`, payload: id };
        }

        if (res.status === 200) {
          return { ...action, type: `${this.key}/updated` };
        }

        // Err
        return action;
      }),
    );
  }

  // CRUD: DELETE
  delete(id) {
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      map(action => {
        const { res } = action.meta;

        if (!res) {
          // TODO: Is `id` still the same when exec ?
          return { ...action, type: `${this.key}/deleting`, payload: id };
        }

        if (res.status === 200) {
          return { ...action, type: `${this.key}/deleted` };
        }

        // Err
        return action;
      }),
    );
  }

  // CRUD: LIST
  search(where) {
    const action$ = where
      ? this.http.search(this.endpoint, where)
      : this.http.get(this.endpoint);

    return action$.pipe(
      map(action => {
        const { res } = action.meta;

        if (!res) {
          return { ...action, type: `${this.key}/searching`, payload: where };
        }

        if (res.status === 200) {
          return { ...action, type: `${this.key}/searched` };
        }

        // Err
        return action;
      }),
    );
  }
}

// Reducer
const initialState = {
  table: {},
  order: [],
};

function createReducer(key) {
  return produce((draft, { type, payload = {}, meta = {} }) => {
    const { entities, result } = payload;
    const { req, res } = meta;

    if (res && res.ok && type === this.endpoint) {
      produceTable(draft, entities[key]);

      if (req.method === 'GET' && Array.isArray(result)) {
        produceOrder(draft, result);
      }
    }
  }, initialState);
}

function produceTable(draft, entities) {
  for (const [id, data] of Object.entries(entities)) {
    if (draft.table[id]) {
      // Merge
      Object.assign(draft.table[id], data);
    } else {
      // Set
      draft.table[id] = data;
    }
  }
}

function produceOrder(draft, result) {
  const changed =
    result.length !== draft.order.length ||
    result.some(id => !draft.order.includes(id));

  if (changed) {
    draft.order = result;
  }
}

// Selectors
const createSelectTable = key => state => state[key].table;

const createSelectOrder = key => state => state[key].order;

const createSelectRelations = relations => state => {
  const tables = {};

  relations.forEach(key => {
    tables[key] = state[key].table;
  });

  return tables;
};

const createFind = (schema, relations) =>
  createSelector(
    createSelectTable(schema.key),
    createSelectRelations(relations),
    (table, id, tables) => {
      return table[id] ? denormalize(table[id], schema, tables) : null;
    },
  );

const createGet = (schema, relations) =>
  createSelector(
    createSelectTable(schema.key),
    createSelectOrder(schema.key),
    createSelectRelations(relations),
    (table, order, tables) =>
      order.map(id => {
        return table[id] ? denormalize(table[id], schema, tables) : null;
      }),
  );

// Credits: https://stackoverflow.com/a/1026087/925307
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function createResource(endpoint, schema) {
  return new ResourceProvider(endpoint, schema);
}
