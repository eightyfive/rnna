import { Bundle } from 'rnna';

import Resource from './resource';

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
    if (services.db) {
      const resource = services[this.schema.key];

      Object.assign(services.db, resource.getSelectors());
    }
  }
}
