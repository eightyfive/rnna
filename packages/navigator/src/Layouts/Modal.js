import { Navigation } from 'react-native-navigation';

import Stack from './Stack';

export default class Modal extends Stack {
  mount(initialProps) {
    Navigation.showModal(this.getInitialLayout(initialProps));
  }

  dismiss() {
    Navigation.dismissModal(this.component.id);
  }
}
