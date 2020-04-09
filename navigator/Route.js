export default /* abstract */ class Route {
  mount(params) {
    throwAbstract('mount');
  }

  unmount(fromId) {
    throwAbstract('unmount');
  }

  getLayout(params) {
    throwAbstract('getLayout');
  }

  getComponent() {
    throwAbstract('getComponent');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Route.${method}`);
}
