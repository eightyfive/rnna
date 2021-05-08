import Navigator from './Navigator';

export default class ModalNavigator extends Navigator {
  constructor(stack) {
    super({}, {});

    this.stack = stack;
  }

  render(componentName, props) {
    this.renderStack(this.stack, componentName, props);
  }

  goBack() {
    this.goBackStack(this.stack);
  }
}
