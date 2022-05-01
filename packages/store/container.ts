// const reNamespace = /(\w+\.)\*/;

type Class<T> = new (...args: any[]) => T;

export class Container<Services extends Record<string, any>> {
  private defined: Map<keyof Services & string, boolean>;
  private instances: Map<keyof Services & string, any>;
  public services: Services;

  constructor() {
    this.defined = new Map();
    this.instances = new Map();

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    this.services = new Proxy<Services>(
      // @ts-ignore
      {},
      {
        get(target, key: keyof Services & string) {
          if (target.hasOwnProperty(key)) {
            return target[key];
          }

          throw new Error(`Service not found: ${key}`);
        },
      },
    );
  }

  public service<T>(name: string, creator: Class<T>, ...depNames: string[]) {
    this.defineSingleton(name, () => {
      const deps = depNames.map(depName => this.services[depName]);

      return new creator(...deps);
    });
  }

  public factory<T>(name: string, getInstance: (services: Services) => T) {
    this.defineSingleton<T>(name, () => getInstance(this.services));
  }

  public value<T>(name: string, value: T) {
    this.defineProperty(name, { value: value });
  }

  private defineSingleton<T>(name: string, createInstance: () => T) {
    this.defineProperty(name, {
      get: () => {
        if (!this.instances.has(name)) {
          this.instances.set(name, createInstance());
        }

        return this.instances.get(name);
      },
    });
  }

  private defineProperty(prop: string, descriptor: PropertyDescriptor) {
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
