import Emitter from './Emitter';

export default /** abstract */ class Layout extends Emitter {
  constructor(config = {}) {
    super();

    this.options = config.options || {};
  }

  mount(initialProps) {
    throwAbstract('mount(initialProps)');
  }

  getLayout(props) {
    throwAbstract('getLayout(props)');
  }

  unmount() {}
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Layout.${method}`);
}
