export default class Router {
  constructor(navigators) {
    this.navigators = new Map(Object.entries(navigators));
    this.name = null;
  }

  get navigator() {
    return this.navigators.get(this.name);
  }

  mount(name, props) {
    this.navigators.get(name).mount(props);

    this.name = name;
  }

  push(name, props) {
    this.navigator.push(name, props);
  }

  pop() {
    this.navigator.pop();
  }

  popTo(id) {
    this.navigator.popTo(id);
  }

  popToRoot() {
    this.navigator.popToRoot();
  }
}
