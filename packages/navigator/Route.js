export default /* abstract */ class Route {
  mount(initialProps) {
    throwAbstract('mount');
  }

  unmount() {
    throwAbstract('unmount');
  }

  getLayout(props) {
    throwAbstract('getLayout');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Route.${method}`);
}
