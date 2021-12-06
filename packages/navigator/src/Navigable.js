import Emitter from './Emitter';

export default class Navigable extends Emitter {
  go(name, props) {
    throwAbstract('push(name, props)');
  }

  goBack() {
    throwAbstract('goBack()');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigable.${method}`);
}
