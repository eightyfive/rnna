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
    Navigation.dismissOverlay(this.component.id);
  }

  navigate(path, params, fromId) {
    this.mount(params);
  }

  goBack(fromId) {
    this.unmount();
  }

  dismiss() {
    this.unmount();
  }

  getComponent() {
    return this.component;
  }
}
