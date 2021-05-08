import { Navigation } from 'react-native-navigation';

import Stack from './Stack';

export default class Modal extends Stack {
  mount(initialProps) {
    Navigation.showModal(this.getInitialLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    const component = this.components.get(this.componentName);

    Navigation.dismissModal(component.id);
  }
}
