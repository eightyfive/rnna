import { Navigation } from 'react-native-navigation';

import { Props } from './Layout';
import { StackNavigator } from './StackNavigator';

export class ModalNavigator extends StackNavigator {
  mount(props: Props) {
    Navigation.showModal(this.layout.getRoot(props));

    this.init();
  }

  show(props: Props) {
    this.mount(props);
  }

  dismiss() {
    Navigation.dismissModal(this.layout.id);
  }
}
