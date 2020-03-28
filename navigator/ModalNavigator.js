import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount() {
    Navigation.showModal(this.getInitialLayout());
  }

  unmount(fromId) {
    Navigation.dismissModal(fromId);
  }

  dismiss(fromId) {
    this.unmount(fromId);
  }
}
