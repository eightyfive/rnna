import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(component, options = {}, config = {}) {
    super({ [component.name]: component }, options, config);

    this.component = component;
  }

  mount(initialProps) {
    Navigation.showOverlay(this.component.getLayout(initialProps));
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

  render(path, props) {
    this.mount(props);
  }

  goBack() {
    this.unmount();
  }
}
