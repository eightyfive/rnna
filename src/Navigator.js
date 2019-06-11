/* eslint-disable class-methods-use-this */

export default /** abstract */ class Navigator {
  getName() {
    if (!this.name) {
      throw new Error("Navigator must have a name");
    }

    return this.name;
  }

  mount() {
    throwAbstract("mount");
  }

  splitPath(path) {
    const [root, ...rest] = path.split("/");

    return [root, rest.join("/") || null];
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
