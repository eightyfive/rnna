import StackNavigator from './StackNavigator';
import Modal from './Layouts/Modal';

export default class ModalNavigator extends StackNavigator {
  constructor(layout) {
    if (!(layout instanceof Modal)) {
      throw new TypeError('Layout must be modal');
    }

    super(layout);
  }
}
