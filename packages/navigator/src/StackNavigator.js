import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
  constructor(stack) {
    super();

    this.stack = stack;
  }

  getLayout() {
    return this.stack;
  }

  getStack() {
    return this.stack;
  }
}
