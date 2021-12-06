import Emitter from './Emitter';

export default class Navigable extends Emitter {
  push(name, props) {
    throwAbstract('push(name, props)');
  }

  pop() {
    throwAbstract('pop()');
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigable.${method}`);
}
