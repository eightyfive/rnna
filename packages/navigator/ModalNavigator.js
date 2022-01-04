import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(props) {
    Navigation.showModal(this.getRoot(props));

    this.init();
  }

  show(props) {
    this.mount(props);
  }

  dismiss() {
    Navigation.dismissModal(this.id);
  }
}
