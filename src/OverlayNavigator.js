import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    if (this.order.length > 1) {
      throw new Error('`OverlayNavigator` only accepts 1 route');
    }

    this.component = this.getRoute(this.initialRouteName);

    if (!(this.component instanceof Component)) {
      throw new Error('`OverlayNavigator` only accepts `Component` route');
    }

    this.component.id = `overlay-${this.component.id}`;
  }

  mount() {
    Navigation.showOverlay(this.component.getLayout());
  }

  unmount() {
    Navigation.dismissOverlay(this.component.id);
  }

  // Aliases
  navigate(route, params, fromId) {
    this.mount();
  }

  goBack(fromId) {
    this.unmount();
  }

  dismiss() {
    this.unmount();
  }
}
