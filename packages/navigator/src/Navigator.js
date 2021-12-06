import Navigable from './Navigable';

export default class Navigator extends Navigable {
  constructor(layout) {
    this.layout = layout;
  }

  getStack() {
    throwAbstract('getStack()');
  }

  mount(props) {
    this.layout.mount(props);
  }

  push(name, props) {
    this.getStack().push(name, props);
  }

  pop() {
    this.getStack().pop();
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
