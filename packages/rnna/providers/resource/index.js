import Provider from '../../provider';
import { createFind, createGet } from './db';
import createReducer from './reducer';
import Resource from './resource';

class ResourceProvider extends Provider {
  constructor(endpoint, entitySchema) {
    super();

    this.name = entitySchema.key;
    this.endpoint = endpoint;
    this.schema = entitySchema;
    this.relations = Object.values(entitySchema.schema).map(schema =>
      Array.isArray(schema) ? schema[0].key : schema.key,
    );
  }

  register(services, reducers, epics) {
    // Services
    Object.assign(services, {
      [this.name]: new Resource(services.api, this.schema.key, this.endpoint),
    });

    // Reducers
    Object.assign(reducers, {
      [this.name]: createReducer(this.schema.key),
    });

    // Selectors
    services.db[this.name] = {};

    Object.assign(services.db[this.name], {
      find: createFind(this.schema, this.relations),
      get: createGet(this.schema, this.relations),
    });
  }
}

export default function createResource(endpoint, schema) {
  return new ResourceProvider(endpoint, schema);
}
