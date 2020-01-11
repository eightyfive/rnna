import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(name, overlay) {
    super(name);

    this.overlay = overlay;
  }

  mount() {
    Navigation.showOverlay(this.overlay.getLayout());
  }

  unmount() {
    Navigation.dismissOverlay(this.overlay.name);
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
