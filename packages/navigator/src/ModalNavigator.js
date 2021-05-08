import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class ModalNavigator extends StackNavigator {
  mount(initialProps) {
    Navigation.showModal(this.getInitialLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    const component = this.getRoute(this.routeName);

    Navigation.dismissModal(component.id);
  }
}
