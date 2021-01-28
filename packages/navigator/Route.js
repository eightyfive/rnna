export default /* abstract */ class Route {
  mount(params) {
    throwAbstract('mount');
  }

  unmount() {
    throwAbstract('unmount');
  }

  getLayout(params) {
    throwAbstract('getLayout');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Route.${method}`);
}