import Navigator from './Navigator';
import Stack from './Layouts/Stack';

export default class StackNavigator extends Navigator {
  constructor(layout) {
    if (!(layout instanceof Stack)) {
      throw new TypeError('Layout must be stack');
    }

    super(layout);
  }

  getStack() {
    return this.layout;
  }
}
