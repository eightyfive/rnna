import { Navigation } from 'react-native-navigation';

import { Props } from './types';
import { Stack } from './Stack';

export class Modal extends Stack {
  mount(props?: Props) {
    this.show(props);
  }

  show(props?: Props) {
    Navigation.showModal(this.getRoot(props));
  }

  dismiss() {
    Navigation.dismissModal(this.id);
  }
}
