import { denormalize, normalize } from 'normalizr';
import { singular } from 'pluralize';
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';

export default class Resource {
  constructor(endpoint, schema) {
    this.endpoint = endpoint;
    this.schema = schema;

    const pluralName = capitalize(schema.key); // Ex: Users
    const singularName = singular(pluralName); // Ex: User

    this.dictionary = {
      setResource: `set${singularName}`,
      setResources: `set${pluralName}`,
      getResource: `get${singularName}`,
      getResources: `get${pluralName}`,
    };
  }

  create(data) {
    return this.endpoint.create(data).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResource}`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
          'create',
        );
      }),
    );
  }

  read(id) {
    return this.endpoint.read(id).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResource}`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
          'read',
        );
      }),
    );
  }

  update(id, data) {
    return this.endpoint.update(id, data).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResource}`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
          'update',
        );
      }),
    );
  }

  delete(id) {
    return this.endpoint.delete(id).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResource}`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
          'delete',
        );
      }),
    );
  }

  list(query) {
    return this.endpoint.list(query).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResources}`,
          normalized ? data : normalize(data, [this.schema]),
          this.schema,
          'list',
          query,
        );
      }),
    );
  }

  getSelectors() {
    return {
      [this.dictionary.getResource]: createSelectResource(this.schema),
      [this.dictionary.getResources]: createSelectResources(this.schema),
    };
  }
}

function getData(res) {
  return res.response
    ? res.response.data
      ? res.response.data
      : res.response
    : res;
}

function createAction(type, payload, schema, verb, meta = {}) {
  return {
    type,
    payload,
    meta: {
      ...meta,
      resource: schema.key,
      verb,
    },
  };
}

function createSelectResource(schema) {
  return createCachedSelector(
    (state, id) => id,
    state => state.db.tables,
    (id, entities) => denormalize(id, schema, entities),
  )((state, id) => id);
}

function createSelectResources(schema) {
  return createSelector(
    state => state.db.orders[schema.key],
    state => state.db.tables,
    (result, entities) => denormalize(result || [], [schema], entities),
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
