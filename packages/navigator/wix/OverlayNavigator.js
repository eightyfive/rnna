import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.component = this.get(this.initialRouteName);
  }

  mount(params) {
    Navigation.showOverlay(this.component.getLayout(params));
  }

  unmount() {
    this.dismiss();
  }

  navigate(path, params, fromId) {
    this.mount(params);
  }

  goBack(fromId) {
    this.unmount();
  }

  dismiss() {
    Navigation.dismissOverlay(this.component.id);

    if (this.parent) {
      this.parent.onDismissOverlay(this.id);
    }
  }

  getComponent() {
    return this.component;
  }
}
