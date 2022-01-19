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
      try {
        this.setRoot('splash');
      } catch (err) {}

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

  getComponentProps(component, params = []) {
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

    const props = this.getComponentProps(root.getInitialComponent(), params);

    super.setRoot(name, props);
  }

  // Stack
  push(name, ...params) {
    const stack = this.getStack();

    const props = this.getComponentProps(stack.getComponent(name), params);

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

    const props = this.getComponentProps(modal.getInitialComponent(), params);

    super.showModal(name, props);
  }

  dismissModal(name) {
    super.dismissModal(name);

    this.update();
  }

  // Overlay
  showOverlay(name, ...params) {
    const overlay = this.getOverlay(name);

    const props = this.getComponentProps(overlay.getInitialComponent(), params);

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
    if (this.rootName) {
      const components = [this.rootName]
        .concat(this.modalNames)
        .concat(this.overlayNames)
        .map(name => this.navigators.get(name))
        .reduce((acc, navigator) => {
          return acc.concat(navigator.getComponents());
        }, []);

      components.forEach(component => {
        const params = this.params.get(component.id);
        const props = this.getComponentProps(component, params);

        component.update(props);
      });
    }
  }
}
