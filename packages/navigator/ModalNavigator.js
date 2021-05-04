import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(initialProps) {
    Navigation.showModal(this.getInitialLayout(initialProps));
  }

  unmount() {
    const component = this.components.get(this.componentName);

    Navigation.dismissModal(component.id);
  }

  dismiss() {
    this.unmount();
  }
}
