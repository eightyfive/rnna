export default class Container {
  constructor() {
    this.defined = new Map();
    this.instances = new Map();
    this.services = {};
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
