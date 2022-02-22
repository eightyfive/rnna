import { catchError, map } from 'rxjs/operators';
import { normalize } from 'normalizr';

export default class Resource {
  constructor(endpoint, schema) {
    this.endpoint = endpoint;
    this.schema = schema;
  }

  create(data) {
    return this.endpoint.create(data).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `${this.schema.key}/create/fulfilled`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
        );
      }),
      catchError(err =>
        createAction(`${this.schema.key}/create/rejected`, err, this.schema),
      ),
      startWith(
        createAction(
          `${this.schema.key}/create/pending`,
          undefined,
          this.schema,
        ),
      ),
    );
  }

  read(id) {
    return this.endpoint.read(id).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `${this.schema.key}/read/fulfilled`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
        );
      }),
      catchError(err =>
        createAction(`${this.schema.key}/read/rejected`, err, this.schema),
      ),
      startWith(
        createAction(`${this.schema.key}/read/pending`, undefined, this.schema),
      ),
    );
  }

  update(id, data) {
    return this.endpoint.update(id, data).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `${this.schema.key}/update/fulfilled`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
        );
      }),
      catchError(err =>
        createAction(`${this.schema.key}/update/rejected`, err, this.schema),
      ),
      startWith(
        createAction(
          `${this.schema.key}/update/pending`,
          undefined,
          this.schema,
        ),
      ),
    );
  }

  delete(id) {
    return this.endpoint.delete(id).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `${this.schema.key}/delete/fulfilled`,
          normalized ? data : normalize(data, this.schema),
          this.schema,
        );
      }),
      catchError(err =>
        createAction(`${this.schema.key}/delete/rejected`, err, this.schema),
      ),
      startWith(
        createAction(
          `${this.schema.key}/delete/pending`,
          undefined,
          this.schema,
        ),
      ),
    );
  }

  list(query, queryId) {
    return this.endpoint.list(query).pipe(
      map(res => {
        const data = getData(res);
        const normalized = Boolean(data.entities && data.result);

        return createAction(
          `${this.schema.key}/list/fulfilled`,
          normalized ? data : normalize(data, [this.schema]),
          this.schema,
          { query, queryId },
        );
      }),
      catchError(err =>
        createAction(`${this.schema.key}/list/rejected`, err, this.schema),
      ),
      startWith(
        createAction(`${this.schema.key}/list/pending`, undefined, this.schema),
      ),
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

function createAction(type, payload, schema, meta = {}) {
  return {
    type,
    payload,
    meta: {
      ...meta,
      resource: schema.key,
    },
  };
}
