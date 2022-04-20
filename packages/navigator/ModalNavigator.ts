import { Navigation } from 'react-native-navigation';

import { Props } from './Layout';
import { Stack } from './Stack';

export class ModalNavigator extends Stack {
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
