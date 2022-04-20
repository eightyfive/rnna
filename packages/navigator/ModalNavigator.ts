import { Navigation } from 'react-native-navigation';

import { Props } from './Layout';
import { StackNavigator } from './StackNavigator';

export class ModalNavigator extends StackNavigator {
  mount(props?: Props) {
    this.show(props);
  }

  show(props: Props) {
    Navigation.showModal(this.getRoot(props));

    this.init();
  }

  dismiss() {
    Navigation.dismissModal(this.id);
  }
}
