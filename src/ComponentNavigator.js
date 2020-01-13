import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class ComponentNavigator extends Navigator {
  constructor(component) {
    super();

    this.component = component;
  }

  mount() {
    Navigation.setRoot({ root: this.component.getLayout() });
  }
}
