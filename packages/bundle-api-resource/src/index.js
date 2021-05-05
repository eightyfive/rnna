import { Bundle } from 'rnna';

import createReducer from './reducer';
import Resource from './resource';
import { createFind, createGet } from './selectors';

export default class ResourceBundle extends Bundle {
  constructor(name) {
    super();

    this.name = name;
  }

  register(container) {
    container.service(
      this.name,
      Resource,
      `${this.name}.endpoint`,
      `${this.name}.schema`,
    );
  }

  boot(services, store) {
    // Selectors
    const resource = services[this.name];
    const entity = resource.schema;

    // TODO: plural, singular for: getUsers, findUser.
    const Name = this.name;
    const Names = this.name;

    const relations = Object.values(entity.schema).map(schema =>
      Array.isArray(schema) ? schema[0].key : schema.key,
    );

    Object.assign(services.db, {
      [`find${Name}`]: createFind(entity, relations),
      [`get${Names}`]: createGet(entity, relations),
    });
  }

  getReducers() {
    return { [this.name]: createReducer(this.name) };
  }

  getEpics() {
    return [];
  }
}
