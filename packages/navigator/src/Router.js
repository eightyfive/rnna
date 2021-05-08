export default /** abstract */ class Router {
  constructor(layouts, config = {}) {
    super();

    this.layouts = new Map(Object.entries(layouts));
    this.config = config;
    this.order = Array.from(this.layouts.keys());
    this.name = null;
    this.listeners = {};
  }

  render(path, props) {
    throwAbstract('render(path, props)');
  }

  goBack() {
    throwAbstract('goBack()');
  }

  readPath(path) {
    const [name, ...childPath] = path.split('/');

    return [name, childPath.length ? childPath.join('/') : null];
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Router.${method}`);
}
