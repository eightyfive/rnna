import { Navigation, Options, OverlayOptions } from 'react-native-navigation';

import { Component } from './Component';
import { Props } from './types';

export class Overlay extends Component<OverlayOptions> {
  protected getOptions(options: OverlayOptions): Options {
    return {
      overlay: options,
    };
  }

  public mount(props?: Props) {
    this.show(props);
  }

  public show(props?: Props) {
    Navigation.showOverlay(this.getRoot(props));
  }

  public dismiss() {
    Navigation.dismissOverlay(this.id);
  }
}
