export default /** abstract */ class Layout {
  constructor(config = {}) {
    super();

    this.options = config.options || {};
  }

  getRoot() {
    throwAbstract('getRoot()');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Layout.${method}`);
}
