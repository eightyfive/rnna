import { Navigation } from 'react-native-navigation';

import ComponentNavigator from './ComponentNavigator';

export default class OverlayNavigator extends ComponentNavigator {
  constructor(id, config) {
    super(`overlay-${id}`, config);
  }

  mount() {
    Navigation.showOverlay(this.getLayout());
  }

  unmount() {
    Navigation.dismissOverlay(this.id);
  }

  // Alias
  goBack() {
    this.unmount();
  }

  // Alias
  dismiss() {
    this.unmount();
  }
}
