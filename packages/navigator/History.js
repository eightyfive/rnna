export default class History {
  constructor() {
    this.names = [];
  }

  get current() {
    return Array.from(this.names).pop() || null;
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

  has(name) {
    return this.findIndex(name) > -1;
  }

  isCurrent(name) {
    return this.current === name;
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

  sliceTo(index) {
    this.names.slice(0, index + 1);
  }
}
