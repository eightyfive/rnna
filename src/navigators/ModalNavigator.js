import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount() {
    // TOFIX: Duplicate with StackNavigator.mount
    this.history = [this.initialRouteName];

    Navigation.showModal(this.getLayout(this.initialRouteName));
  }

  unmount(fromId) {
    this.dismiss(fromId);
  }

  dismiss(fromId) {
    Navigation.dismissModal(fromId);
  }
}
