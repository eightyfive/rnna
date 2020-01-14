import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class ComponentNavigator extends Navigator {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  getLayout(passProps) {
    const layout = {
      id: this.id,
      name: this.id,
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    if (passProps) {
      layout.passProps = passProps;
    }

    return { component: layout };
  }
}
