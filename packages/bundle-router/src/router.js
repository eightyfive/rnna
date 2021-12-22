import RootNavigator from '@rnna/navigator/RootNavigator';

const defaultOptions = {
  globalProps: {},
  getGlobalProps: () => ({}),
};

export default class Router extends RootNavigator {
  constructor(navigators, options) {
    super(navigators);

    this.options = Object.assign({}, defaultOptions, options || {});
    this.state = null;
    this.services = {};
    this.params = new Map();

    this.appLaunched = new Promise(this.launchApp);
  }

  launchApp = resolve => {
    const handleAppLaunched = () => {
      resolve();

      this.removeListener('AppLaunched', handleAppLaunched);
    };

    this.addListener('AppLaunched', handleAppLaunched);
  };

  setServices(services) {
    this.services = services;
  }

  setGlobalProp(name, value) {
    this.options.globalProps[name] = value;
  }

  getProps(navigator, params = []) {
    const component = navigator.getComponent();

    // Remember params
    this.params.set(component.id, params);

    const { globalProps, getGlobalProps } = this.options;

    return Object.assign(
      {},
      globalProps,
      getGlobalProps(this.services),
      component.ReactComponent.controller(...params, this.services),
    );
  }

  // Root
  setRoot(name, ...params) {
    const root = this.getRoot(name);

    const props = this.getProps(root, params);

    super.mount(name, props);
  }

  // Stack
  push(name, ...params) {
    const stack = this.getStack();

    const props = this.getProps(stack, params);

    super.push(name, props);
  }

  pop() {
    super.pop();

    this.update();
  }

  popTo(id) {
    super.popTo(id);

    this.update();
  }

  popToRoot() {
    super.popToRoot();

    this.update();
  }

  // BottomTabs
  selectTab(index) {
    super.selectTab(index);

    this.update();
  }

  // Modal
  showModal(name, ...params) {
    const modal = this.getModal(name);

    const props = this.getProps(modal, params);

    super.showModal(name, props);
  }

  dismissModal(name) {
    super.dismissModal(name);

    this.update();
  }

  // Overlay
  showOverlay(name, ...params) {
    const overlay = this.getOverlay(name);

    const props = this.getProps(overlay, params);

    super.showOverlay(name, props);
  }

  dismissOverlay(name) {
    super.dismissOverlay(name);

    this.update();
  }

  onState(state) {
    if (this.state !== state) {
      this.state = state;

      // If mounted
      if (this.navigator) {
        this.update();
      }
    }
  }

  update() {
    const navigators = [];

    if (this.rootName) {
      navigators.push(this.getRoot(this.rootName));
    }

    if (this.modalNames.length) {
      for (const name of this.modalNames) {
        navigators.push(this.getModal(name));
      }
    }

    if (this.overlayNames.length) {
      for (const name of this.overlayNames) {
        navigators.push(this.getOverlay(name));
      }
    }

    for (const navigator of navigators) {
      const component = navigator.getComponent();

      const params = this.params.get(component.id);

      const props = this.getProps(navigator, params);

      component.update(props);
    }
  }
}
