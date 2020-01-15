import { Navigation } from 'react-native-navigation';

export default /* abstract */ class Layout {
  constructor(id, config = {}) {
    super();

    this.id = id;
    this.options = config.options;
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  getLayout(passProps) {
    throwAbstract('getLayout');
  }
}

function throwAbstract(method) {
  if (__DEV__) {
    throw new Error(`Abstract: Implement Navigator.${method}`);
  }
}
