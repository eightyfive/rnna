import { Navigation } from 'react-native-navigation';

import Component from './Component';

export default class Overlay extends Component {
  mount(initialProps) {
    Navigation.showOverlay(this.getLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    Navigation.dismissOverlay(this.id);
  }
}
