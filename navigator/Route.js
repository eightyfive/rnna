export default /* abstract */ class Route {
  mount() {
    throwAbstract('mount');
  }

  unmount(fromId) {
    throwAbstract('mount');
  }

  getLayout() {
    throwAbstract('getLayout');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Route.${method}`);
}
