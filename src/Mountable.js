export default /* abstract */ class Mountable {
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
  throw new Error(`Abstract: Implement Mountable.${method}`);
}
