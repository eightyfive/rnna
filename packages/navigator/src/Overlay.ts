import { Navigation } from 'react-native-navigation';

import { Component } from './Component';
import { Props } from './Layout';

export class Overlay extends Component {
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
