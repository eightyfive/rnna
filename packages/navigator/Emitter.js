import Events from './Events';

export default /** abstract */ class Emitter {
  constructor() {
    this.listeners = {};
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
}
