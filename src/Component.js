export default class Component {
  constructor(id, options) {
    this.id = id;
    this.options = options;
  }

  getLayout(passProps) {
    const layout = {
      id: this.id,
      name: this.id,
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    if (passProps) {
      layout.passProps = passProps;
    }

    return { component: layout };
  }
}
