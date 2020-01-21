import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.component = this.getRoute(this.initialRouteName);
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
