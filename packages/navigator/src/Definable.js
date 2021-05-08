export default /** abstract */ class Definable {
  constructor() {
    this.defined = new Map();
  }

  defineProperty(name, value) {
    if (this.defined.has(name)) {
      throw new Error(`${name} is already defined`);
    }

    this.defined.set(name, true);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
    Object.defineProperty(this, name, { enumerable: true, value });
  }
}
