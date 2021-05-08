export default class History {
  constructor() {
    this.names = [];
  }

  get() {
    return this.names;
  }

  reset(initialName) {
    this.names = [initialName];
  }

  push(name) {
    this.names.push(name);
  }

  pop() {
    return this.names.pop();
  }

  popTo(index) {
    this.names.splice(index + 1);
  }

  has(name) {
    return this.findIndex(name) > -1;
  }

  isCurrent(name) {
    const last = Array.from(this.history).pop();

    return last === name;
  }

  size(len = null) {
    const size = this.names.length;

    if (len) {
      return size === len;
    }

    return size;
  }

  forEach(cb) {
    this.names.forEach(cb);
  }

  findIndex(name) {
    return this.names.findIndex(val => val === name);
  }
}
