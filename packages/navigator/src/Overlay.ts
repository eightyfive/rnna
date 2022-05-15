import { Navigation, Options, OverlayOptions } from 'react-native-navigation';

import { Component } from './Component';
import { Props } from './types';

export class Overlay extends Component<OverlayOptions> {
  getOptions(options: OverlayOptions): Options {
    return {
      overlay: options,
    };
  }

  mount(props?: Props) {
    this.show(props);
  }

  show(props?: Props) {
    Navigation.showOverlay(this.getRoot(props));
  }

  dismiss() {
    Navigation.dismissOverlay(this.id);
  }
}
