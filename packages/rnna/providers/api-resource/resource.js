export default class Resource {
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
