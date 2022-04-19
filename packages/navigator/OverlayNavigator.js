import { Navigation } from 'react-native-navigation';

import { Component } from './Component';

export default class OverlayNavigator extends Component {
  mount(props) {
    this.show(props);
  }

  show(props) {
    Navigation.showOverlay(this.getRoot(props));
  }

  dismiss() {
    Navigation.dismissOverlay(this.id);
  }
}
