import { Bundle } from 'rnna';

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
    // TODO: plural, singular for: getUsers, findUser.
    const Name = this.schema.key;
    const Names = this.schema.key;

    Object.assign(services.db, {
      [`find${Name}`]: createFind(this.schema),
      [`get${Names}`]: createGet(this.schema),
    });
  }
}
