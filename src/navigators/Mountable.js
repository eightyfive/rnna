export default /* abstract */ class Mountable {
  mount() {
    throwAbstract('mount');
  }

  getLayout() {
    throwAbstract('getLayout');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Mountable.${method}`);
}
