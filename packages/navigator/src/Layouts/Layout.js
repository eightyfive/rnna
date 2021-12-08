import { Navigation } from 'react-native-navigation';

export default /** abstract */ class Layout {
  constructor(config = {}) {
    this.options = config.options || {};
  }

  mount(props) {
    Navigation.setRoot({ root: this.getRoot(props) });
  }

  getRoot(props) {
    throwAbstract('getRoot(props)');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Layout.${method}`);
}
