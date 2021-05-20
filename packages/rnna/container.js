const reNamespace = /(\w+\.)\*/;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
const handler = {
  get(target, key) {
    if (target.hasOwnProperty(key)) {
      return target[key];
    }

    const [, namespace] = reNamespace.exec(key) || [];

    if (!namespace) {
      throw new Error(`Service not found: ${key}`);
    }

    const services = {};

    Object.entries(target).forEach(([name, service]) => {
      if (name.indexOf(namespace) === 0) {
        services[name.replace(namespace, '')] = service;
      }
    });

    if (!Object.keys(services).length) {
      throw new Error(`Namespace not found: ${key}`);
    }

    return services;
  },
};

export default class Container {
  constructor() {
    this.defined = new Map();
    this.instances = new Map();
    this.services = new Proxy({}, handler);
  }

  service(name, creator, ...deps) {
    this.defineSingleton(name, () => {
      const args = deps.map(dep => this.services[dep]);

      return new creator(...args);
    });
  }

  factory(name, getInstance) {
    this.defineSingleton(name, () => getInstance(this.services));
  }

  constant(name, value) {
    this.defineProperty(name, { value: value });
  }

  resolve(name) {
    if (this.services.hasOwnProperty(name)) {
      return this.services[name];
    }

    const services = {};
    const namespace = `${name}.`;

    this.defined.forEach(key => {
      if (key.indexOf(namespace) === 0) {
        services[key.replace(namespace, '')] = this.services[key];
      }
    });

    return services;
  }

  defineSingleton(name, getInstance) {
    this.defineProperty(name, {
      get: () => {
        if (!this.instances.has(name)) {
          this.instances.set(name, getInstance());
        }

        return this.instances.get(name);
      },
    });
  }

  defineProperty(prop, descriptor) {
    if (this.defined.has(prop)) {
      throw new Error(`container.${prop} is already defined`);
    }

    this.defined.set(prop, true);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
    Object.defineProperty(
      this.services,
      prop,
      Object.assign({ enumerable: true }, descriptor),
    );
  }
}
