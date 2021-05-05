import { ofAction } from 'rnna/rx';

export default class Resource {
  constructor(endpoint, schema) {
    this.endpoint = endpoint;
    this.schema = schema;
  }

  store(data) {
    return this.endpoint.create(data).pipe(
      map(action => {
        const { req, res } = action.meta;

        if (req && !res) {
          return { ...action, type: `${this.schema.key}/storing` };
        }

        if (req && res && res.status === 200) {
          return { ...action, type: `${this.schema.key}/stored` };
        }

        // Error action
        return action;
      }),
    );
  }

  find(id) {
    return this.endpoint.read(id).pipe(
      map(action => {
        const { req, res } = action.meta;

        if (req && !res) {
          return { ...action, type: `${this.schema.key}/finding` };
        }

        if (req && res && res.status === 200) {
          return { ...action, type: `${this.schema.key}/found` };
        }

        // Error action
        return action;
      }),
    );
  }

  update(id, data) {
    return this.endpoint.update(id, data).pipe(
      map(action => {
        const { req, res } = action.meta;

        if (req && !res) {
          return { ...action, type: `${this.schema.key}/updating` };
        }

        if (req && res && res.status === 200) {
          return { ...action, type: `${this.schema.key}/updated` };
        }

        // Error action
        return action;
      }),
    );
  }

  delete(id) {
    return this.endpoint.delete(id).pipe(
      map(action => {
        const { req, res } = action.meta;

        if (req && !res) {
          return { ...action, type: `${this.schema.key}/deleting` };
        }

        if (req && res && res.status === 200) {
          return { ...action, type: `${this.schema.key}/deleted` };
        }

        // Error action
        return action;
      }),
    );
  }

  list(filters) {
    return this.endpoint.list(filters).pipe(
      map(action => {
        const { req, res } = action.meta;

        if (req && !res) {
          return { ...action, type: `${this.schema.key}/listing` };
        }

        if (req && res && res.status === 200) {
          return { ...action, type: `${this.schema.key}/listed` };
        }

        // Error action
        return action;
      }),
    );
  }
}
