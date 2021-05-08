import Events from './Events';

export default /** abstract */ class Layout {
  constructor(config = {}) {
    this.defined = new Map();
    this.options = config.options || {};
    this.listeners = {};
  }

  defineProperty(name, value) {
    if (this.defined.has(name)) {
      throw new Error(`${name} is already defined`);
    }

    this.defined.set(name, true);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
    Object.defineProperty(this, name, { enumerable: true, value });
  }

  addListener(eventName, listener) {
    const subscription = Events.addListener(eventName, listener);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(subscription);

    return subscription;
  }

  removeListener(eventName, listener) {
    const subscription = this.listeners[eventName].find(cb => cb === listener);

    if (subscription) {
      Events.removeListener(subscription);

      this.listeners[eventName] = this.listeners[eventName].filter(
        cb => cb !== listener,
      );
    }
  }

  mount(initialProps) {
    throwAbstract('mount');
  }

  getLayout(props) {
    throwAbstract('getLayout');
  }

  unmount() {}
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Layout.${method}`);
}
