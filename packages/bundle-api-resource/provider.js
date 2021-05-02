import { ServiceProvider } from 'rnna';

import { createFind, createGet } from './selectors';
import Resource from './resource';

export default class ResourceProvider extends ServiceProvider {
  constructor(name) {
    super();

    this.name = name;
  }

  register(container) {
    container.factory(`${this.name}.service`, ns => {
      return new Resource(ns.endpoint, ns.schema);
    });

    container.alias(this.name, `${this.name}.service`);
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
}
