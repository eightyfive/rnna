export default /** abstract */ class Navigator {
  constructor(name) {
    this.name = name;
  }

  mount() {
    throwAbstract('mount');
  }

  unmount(fromId) {}

  splitPath(path) {
    const [root, ...rest] = path.split('/');

    return [root, rest.join('/') || null];
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
