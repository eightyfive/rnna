import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Layout from './Layout';

export default class Overlay extends Layout {
  constructor(component, config = {}) {
    super(config);

    if (!(component instanceof Component)) {
      throw new TypeError('Invalid argument', 'Overlay.js', 7);
    }

    this.component = component;

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  mount(initialProps) {
    Navigation.showOverlay(this.component.getLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    Navigation.dismissOverlay(this.component.id);
  }
}
