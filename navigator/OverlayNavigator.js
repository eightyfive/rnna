import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.component = this.get(this.initialRouteName);
  }

  mount() {
    Navigation.showOverlay(this.component.getLayout());
  }

  unmount() {
    Navigation.dismissOverlay(this.component.id);
  }

  go(path, params, fromId) {
    //
  }

  goBack(fromId) {
    this.unmount();
  }

  dismiss() {
    this.unmount();
  }
}