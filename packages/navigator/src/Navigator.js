import Emitter from './Emitter';

export default class Navigator extends Emitter {
  getLayout() {
    throwAbstract('getLayout()');
  }

  getStack() {
    throwAbstract('getStack()');
  }

  mount(props) {
    this.getLayout().mount(props);
  }

  push(name, props) {
    this.getStack().push(name, props);
  }

  pop() {
    this.getStack().pop();
  }

  popTo(id) {
    this.getStack().popTo(id);
  }

  popToRoot() {
    this.getStack().popToRoot();
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
