import Emitter from './Emitter';

export default class RootNavigator extends Emitter {
  constructor(navigators) {
    super();

    for (const [name, navigator] of Object.entries(navigators)) {
      Object.assign(this, { [name]: navigator });
    }
  }
}
