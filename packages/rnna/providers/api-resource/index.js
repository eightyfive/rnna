import Bundle from '../../bundle';
import { createFind, createGet } from './db';
import events from './events';
import createReducer from './reducer';
import Resource from './resource';

class ResourceBundle extends Bundle {
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
      [this.name]: new Resource(services.api, this.name, this.endpoint),
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

    // Events
    epics.push(...events);
  }
}

export default function bundleResource(endpoint, schema) {
  return new ResourceBundle(endpoint, schema);
}
