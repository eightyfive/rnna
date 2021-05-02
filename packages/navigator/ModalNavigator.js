import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(initialProps) {
    Navigation.showModal(this.getInitialLayout(initialProps));
  }

  unmount() {
    Navigation.dismissModal(this.route.id);
  }

  dismiss() {
    this.unmount();
  }
}
