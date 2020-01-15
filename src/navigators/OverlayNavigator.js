import { Navigation } from 'react-native-navigation';

import Component from './Component';

export default class OverlayNavigator extends Component {
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
