import Mountable from './Mountable';

export default class Component extends Mountable {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
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
