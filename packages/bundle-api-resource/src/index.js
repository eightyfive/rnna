import { Bundle } from 'rnna';

import createReducer from './reducer';
import Resource from './resource';
import { createFind, createGet } from './selectors';

export default class ResourceBundle extends Bundle {
  constructor(schema) {
    super();

    this.schema = schema;
  }

  register(container) {
    container.factory(
      this.schema.key,
      ({ api }) => new Resource(api.endpoint(this.schema.key), this.schema),
    );
  }

  boot(services, store) {
    // Selectors
    const resource = services[this.schema.key];
    const entity = resource.schema;

    // TODO: plural, singular for: getUsers, findUser.
    const Name = this.schema.key;
    const Names = this.schema.key;

    const relations = Object.values(entity.schema).map(schema =>
      Array.isArray(schema) ? schema[0].key : schema.key,
    );

    Object.assign(services.db, {
      [`find${Name}`]: createFind(entity, relations),
      [`get${Names}`]: createGet(entity, relations),
    });
  }

  getReducers() {
    return { [this.schema.key]: createReducer(this.schema.key) };
  }

  getEpics() {
    return [];
  }
}
