import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(component, options = {}, config = {}) {
    super({ [component.name]: component }, options, config);

    this.component = component;
  }

  mount(params) {
    Navigation.showOverlay(this.component.getLayout(params));
  }

  unmount() {
    this.dismiss();
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

  navigate(path, params) {
    this.mount(params);
  }

  goBack() {
    this.unmount();
  }
}
