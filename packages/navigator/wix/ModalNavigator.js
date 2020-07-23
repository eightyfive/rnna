import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(params) {
    Navigation.showModal(this.getInitialLayout(params));
  }

  unmount() {
    Navigation.dismissModal(this.route.id);
  }

  dismiss() {
    this.unmount();
  }
}
