import Emitter from './Emitter';

export default class Navigator extends Emitter {
  getLayout() {
    throwAbstract('getLayout()');
  }

  getStack() {
    throwAbstract('getStack()');
  }

  mount(initialProps) {
    this.getLayout().mount(initialProps);
  }

  push(toName, props) {
    this.getStack().push(toName, props);
  }

  pop() {
    this.getStack().pop();
  }

  popTo(toId) {
    this.getStack().popTo(toId);
  }

  popToRoot() {
    this.getStack().popToRoot();
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
