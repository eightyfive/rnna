import { map } from 'rxjs/operators';
import { normalize } from 'normalizr';
import { singular } from 'pluralize';

export default class Resource {
  constructor(endpoint, schema) {
    this.endpoint = endpoint;
    this.schema = schema;

    const pluralName = capitalize(schema.key); // Ex: Users
    const singularName = singular(pluralName); // Ex: User

    this.dictionary = {
      setResource: `set${singularName}`,
      setResources: `set${pluralName}`,
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

  list(query, queryId) {
    return this.endpoint.list(query).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `http/${this.dictionary.setResources}`,
          normalized ? data : normalize(data, [this.schema]),
          this.schema,
          'list',
          { query, queryId },
        );
      }),
    );
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
