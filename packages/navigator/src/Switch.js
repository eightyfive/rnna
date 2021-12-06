export default class Switch {
  constructor(navigators) {
    this.navigators = new Map(Object.entries(navigators));
    this.name = null;
  }

  get navigator() {
    if (!this.name) {
      throw new Error('No navigator mounted');
    }

    return this.navigators.get(this.name);
  }

  mount(name, props) {
    if (!this.navigators.has(name)) {
      throw new Error(`Navigator not found: ${name}`);
    }

    this.navigators.get(name).mount(props);

    this.name = name;
  }

  go(name, props) {
    this.navigator.go(name, props);
  }

  goBack() {
    this.navigator.goBack();
  }
}
