import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount() {
    // TOFIX: Duplicate with Stack.mount
    this.history = [this.initialComponentId];

    Navigation.showModal(this.getInitialLayout());
  }

  unmount(fromId) {
    this.dismiss(fromId);
  }

  dismiss(fromId) {
    Navigation.dismissModal(fromId);
  }
}
