import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(props) {
    this.show(props);
  }

  show(props) {
    Navigation.showModal(this.getRoot(props));
  }

  dismiss() {
    Navigation.dismissModal(this.id);
  }
}
