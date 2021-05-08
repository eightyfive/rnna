export default /** abstract */ class Definable {
  defineProperty(name, value) {
    if (this[name]) {
      throw new Error(`${name} is already defined`);
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
    Object.defineProperty(this, name, { enumerable: true, value });
  }
}
