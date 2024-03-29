import { Bundle } from 'rnna';

import Resource from './resource';

export default class ResourcesBundle extends Bundle {
  constructor(options) {
    super(options);

    this.schemas = Object.values(this.options.schemas);
  }

  register(container) {
    container.factory('resources', ({ api }) => {
      const resources = {};

      for (const schema of this.schemas) {
        resources[schema.key] = new Resource(api.endpoint(schema.key), schema);
      }

      return resources;
    });
  }

  boot(services, store) {
    if (services.db) {
      for (const schema of this.schemas) {
        services.db.addTable(schema);
      }
    }
  }
}
