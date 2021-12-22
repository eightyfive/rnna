import { Navigation } from 'react-native-navigation';

import Emitter from '../Emitter';

export default /** abstract */ class Layout extends Emitter {
  constructor(config = {}) {
    super();

    this.options = config.options || {};
  }

  mount(props) {
    Navigation.setRoot({ root: this.getRoot(props) });
  }

  getRoot(props) {
    throwAbstract('getRoot(props)');
  }

  getInitialComponent() {
    throwAbstract('getInitialComponent()');
  }

  getComponents() {
    throwAbstract('getComponents()');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Layout.${method}`);
}
