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
  }

  setServices(services) {
    this.services = services;
  }

  setGlobalProp(name, value) {
    this.options.globalProps[name] = value;
  }

  getProps(navigator, params = []) {
    const { ReactComponent } = navigator.getComponent();

    const { globalProps, getGlobalProps } = this.options;

    return Object.assign(
      {},
      globalProps,
      getGlobalProps(this.services),
      ReactComponent.controller(...params, this.services),
    );
  }

  // Root
  mount(name) {
    const root = this.getRoot(name);

    const props = this.getProps(root);

    super.mount(name, props);
  }

  // Stack
  push(name) {
    const stack = this.getStack();

    const props = this.getProps(stack);

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
  showModal(name) {
    const modal = this.getModal(name);

    const props = this.getProps(modal);

    super.showModal(name, props);
  }

  dismissModal(name) {
    super.dismissModal(name);

    this.update();
  }

  // Overlay
  showOverlay(name) {
    const overlay = this.getOverlay(name);

    const props = this.getProps(overlay);

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

    if (this.root) {
      navigators.push(this.root);
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
      const props = this.getProps(navigator);

      component.update(props);
    }
  }
}
