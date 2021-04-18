import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import Plugin from '../plugin';

class ResourcePlugin extends Plugin {
  constructor(endpoint, entitySchema) {
    super(entitySchema.key);

    this.endpoint = endpoint;
    this.schema = entitySchema;
  }

  register({ api }) {
    return new Resource(api, this.endpoint, this.schema);
  }

  getReducer() {
    return createReducer(this.schema.key);
  }
}

class Resource {
  constructor(http, endpoint, entitySchema) {
    this.http = http;
    this.endpoint = endpoint;
    this.key = entitySchema.key;
    this.schema = entitySchema;
    this.relations = Object.values(entitySchema.schema).map(schema =>
      Array.isArray(schema) ? schema[0].key : schema.key,
    );
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

  find(state, id) {
    if (!this.selectFind) {
      this.selectFind = createSelector(
        this.selectTable,
        this.selectTables,
        (table, tables, id) => this.denormalize(table, id, tables),
      );
    }

    return this.selectFind(state, id);
  }

  getResult(state) {
    if (!this.selectResult) {
      this.selectResult = createSelector(
        this.selectTable,
        this.selectOrder,
        this.selectTables,
        (table, order, tables) => {
          return order.map(id => this.denormalize(table, id, tables));
        },
      );
    }

    return this.selectResult(state);
  }

  selectTable = state => state[this.key].table;

  selectOrder = state => state[this.key].order;

  selectTables = state => {
    const tables = {};

    this.relations.forEach(key => {
      tables[key] = state[key].table;
    });

    return tables;
  };

  denormalize(table, id, tables) {
    const row = table[id];

    if (!row) {
      return null;
    }

    return denormalize(row, this.schema, tables);
  }
}

// Resource reducer
const initialState = {
  table: {},
  order: [],
};

function createReducer(key) {
  return produce((draft, { type, payload = {}, meta = {} }) => {
    const { entities, result } = payload;

    if (entities) {
      produceTable(draft, entities[key]);
    }

    if (type === this.endpoint) {
      const { req, res } = meta;

      if (
        req.method === 'GET' &&
        Array.isArray(result) &&
        res &&
        res.status === 200
      ) {
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

export default function createResource(endpoint, schema) {
  return new ResourcePlugin(endpoint, schema);
}
