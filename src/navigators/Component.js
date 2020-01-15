import Layout from './Layout';

export default class Component extends Layout {
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
