import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(stack, config = {}) {
    super(config);

    this.stack = stack;
  }

  getLayout() {
    return this.stack;
  }

  getStack() {
    return this.stack;
  }
}
