import Emitter from './Emitter';

export default class RootNavigator extends Emitter {
  constructor(navigators) {
    super();

    for (const [name, navigator] of Object.entries(navigators)) {
      Object.assign(this, { [name]: navigator });
    }

    this.launched = new Promise(resolve => {
      const handleAppLaunched = () => {
        if (this.splash) {
          this.splash.mount();
        }

        resolve();

        this.removeListener('AppLaunched', handleAppLaunched);
      };

      this.addListener('AppLaunched', handleAppLaunched);
    });
  }
}
