import { ofAction } from 'rnna/rx';

export default class Resource {
  constructor(http, name, endpoint) {
    this.http = http;
    this.endpoint = endpoint;
    this.name = name;
  }

  // CRUD: CREATE
  create(data) {
    return ofAction(`${this.name}/creating`, data, { resource: this.name });
  }

  doCreate(data) {
    return this.http.post(this.endpoint, data).pipe(
      map(action => {
        const { res } = action.meta;

        if (res) {
          if (res.status === 200) {
            return { ...action, type: `${this.name}/created` };
          }

          // Error action
          return action;
        }
      }),
    );
  }

  // CRUD: READ
  read(id) {
    return ofAction(`${this.name}/reading`, id, { resource: this.name });
  }

  doRead(id) {
    return this.http.get(`${this.endpoint}/${id}`).pipe(
      map(action => {
        const { res } = action.meta;

        if (res) {
          if (res.status === 200) {
            return { ...action, type: `${this.name}/read` };
          }

          // Error action
          return action;
        }
      }),
    );
  }

  // CRUD: UPDATE
  update(id, data) {
    return ofAction(`${this.name}/updating`, data, { id, resource: this.name });
  }

  doUpdate(id, data) {
    return this.http.put(`${this.endpoint}/${id}`, data).pipe(
      map(action => {
        const { res } = action.meta;

        if (res) {
          if (res.status === 200) {
            return { ...action, type: `${this.name}/updated` };
          }

          // Error action
          return action;
        }
      }),
    );
  }

  // CRUD: DELETE
  delete(id) {
    return ofAction(`${this.name}/deleting`, id, { resource: this.name });
  }

  doDelete(id) {
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      map(action => {
        const { res } = action.meta;

        if (res) {
          if (res.status === 200) {
            return { ...action, type: `${this.name}/deleted` };
          }

          // Error action
          return action;
        }
      }),
    );
  }

  // CRUDL: INDEX (list)
  index(filters) {
    return ofAction(`${this.name}/indexing`, filters, { resource: this.name });
  }

  doIndex(filters) {
    const action$ = filters
      ? this.http.search(this.endpoint, filters)
      : this.http.get(this.endpoint);

    return action$.pipe(
      map(action => {
        const { res } = action.meta;

        if (res) {
          if (res.status === 200) {
            return { ...action, type: `${this.name}/indexed` };
          }

          // Error action
          return action;
        }
      }),
    );
  }
}
