import { Navigation } from 'react-native-navigation';

import Component from './Component';

export default class Overlay extends Component {
  mount(initialProps) {
    Navigation.showOverlay(this.getLayout(initialProps));
  }

  dismiss() {
    Navigation.dismissOverlay(this.id);
  }
}
