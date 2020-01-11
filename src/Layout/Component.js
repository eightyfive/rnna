export default class Component {
  constructor(id, options) {
    this.id = id;
    this.name = id;
    this.options = options;
  }

  getLayout(passProps = null) {
    // https://wix.github.io/react-native-navigation/#/docs/layout-types?id=component
    const layout = {
      id: this.id,
      name: this.name,
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
