import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

export default class RootNavigator extends Navigator {
  constructor(navigators, options = {}) {
    super();

    this.navigators = navigators;
    this.route = null;
    this.launched = false;
    this.stack = [];
    this.overlays = [];
    this.fromId = options.initialComponentId || 'Splash';
    this.onLaunched = [];
    this.onTabSelected = [];

    this.didAppearListener = events.registerComponentDidAppearListener(
      this.handleDidAppear,
    );

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear,
    );

    this.modalDismissedListener = events.registerModalDismissedListener(
      this.handleModalDismissed,
    );

    this.tabSelectedListener = events.registerBottomTabSelectedListener(
      this.handleBottomTabSelected,
    );

    this.appLaunchedListener = events.registerAppLaunchedListener(
      this.handleAppLaunched,
    );
  }

  onAppLaunched(cb) {
    this.onLaunched.push(cb);
  }

  handleAppLaunched = () => {
    if (this.launched) {
      this.relaunch();
    } else {
      this.launch();
    }
  };

  launch() {
    this.launched = true;

    const navigator = this.navigators.find((el, i) => i === 0);
    this.navigate(navigator.name);

    this.onLaunched.forEach(cb => cb());
  }

  relaunch() {
    this.stack.forEach(navigator => navigator.mount());
    this.overlays.forEach(overlay => overlay.mount());
  }

  handleDidAppear = ({ componentId }) => {
    if (isScene(componentId)) {
      this.fromId = componentId;

      // console.log('did APPEAR:', componentId);
    }
  };

  handleDidDisappear = ({ componentId }) => {
    if (isScene(componentId)) {
      const routeId = this.getRouteComponentId(this.route);
      const isBack = routeId === componentId;

      if (isBack) {
        // "Back" handled by RNNN or by hardware press back
        this.route = null;
      }

      // console.log('did DISAPPEAR:', componentId, routeId, this.route);
    }
  };

  handleModalDismissed = ({ componentId, modalsDismissed }) => {
    // console.log('modal Dismissed:', componentId, modalsDismissed);

    // Happens when Native back button is pressed.
    // We need to remove/"pop" the top-most modal
    this.stack = this.stack.filter(
      // navigator instanceof ModalNavigator
      navigator => navigator.name !== componentId,
    );
  };

  handleBottomTabSelected = ev =>
    Promise.all(this.onTabSelected.map(handler => handler(ev)));

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  get active() {
    return this.stack[this.stack.length - 1];
  }

  isActive(name) {
    return Boolean(this.active && this.active.name === name);
  }

  isVisible(name) {
    return (
      this.isActive(name) ||
      this.overlays.some(overlay => overlay.name === name)
    );
  }

  getNavigator(name) {
    return this.navigators.find(nav => nav.name === name);
  }

  navigate(route, params) {
    if (!this.launched) {
      throw new Error('RNN not launched yet');
    }

    this.route = route;

    const name = this.getRouteNavigator(route);
    const navigator = this.getNavigator(name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${name} (${route})`);
    }

    // Unmount modals ?
    if (!this.isActive(name) && this.stack.length > 1) {
      const index = this.stack.findIndex(nav => nav.name === name) + 1;

      if (index > 0 && index < this.stack.length) {
        this.stack.splice(index).forEach(nav => nav.unmount(this.fromId));
      }
    }

    // Unmount main ?
    if (
      !this.isActive(name) &&
      this.stack.length === 1 &&
      !(navigator instanceof ModalNavigator)
    ) {
      this.active.unmount(this.fromId);
      this.stack = [];
    }

    // Mount ?
    if (!this.isActive(name)) {
      navigator.mount();
      this.stack.push(navigator);
    }

    const next = this.getRouteNext(route);

    if (next) {
      navigator.navigate(next, params, this.fromId);
    }
  }

  goBack() {
    try {
      this.active.goBack(this.fromId);
    } catch (err) {
      if (this.active instanceof ModalNavigator) {
        this.active.unmount(this.fromId);
        this.stack.pop();
      }
    }
  }

  push(name, params) {
    if (!this.active.push) {
      throwNotSupported(this.active, 'push');
    }

    this.active.push(name, params, this.fromId);
  }

  pop(n = 1) {
    if (!this.active.pop) {
      throwNotSupported(this.active, 'pop');
    }

    this.active.pop(n);
  }

  popToTop() {
    if (!this.active.popToTop) {
      throwNotSupported(this.active, 'popToTop');
    }

    this.active.popToTop(this.fromId);
  }

  openDrawer() {
    if (!this.active.openDrawer) {
      throwNotSupported(this.active, 'openDrawer');
    }

    this.active.openDrawer();
  }

  closeDrawer() {
    if (!this.active.closeDrawer) {
      throwNotSupported(this.active, 'closeDrawer');
    }

    this.active.closeDrawer();
  }

  toggleDrawer() {
    if (!this.active.toggleDrawer) {
      throwNotSupported(this.active, 'toggleDrawer');
    }

    this.active.toggleDrawer();
  }

  dismiss() {
    if (!this.active.dismiss) {
      throwNotSupported(this.active, 'dismiss');
    }

    this.active.dismiss(this.fromId);
  }

  dismissAllModals() {
    const total = this.stack.length;

    this.stack = this.stack.filter(
      navigator => !(navigator instanceof ModalNavigator),
    );

    if (this.stack.length < total) {
      Navigation.dismissAllModals();
    }
  }

  dismissAllOverlays() {
    this.overlays.forEach(overlay => overlay.unmount());
    this.overlays = [];
  }

  isComponentId(id) {
    return this.fromId === id;
  }

  showOverlay(name) {
    const overlay = this.getNavigator(name);

    if (!overlay || !(overlay instanceof OverlayNavigator)) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    overlay.mount();

    this.overlays.push(overlay);
  }

  hideOverlay(name) {
    const index = this.overlays.findIndex(ov => ov.name === name);
    const visible = index !== -1;

    if (visible) {
      const [overlay] = this.overlays.splice(index, 1);

      overlay.unmount();
    } else if (__DEV__) {
      console.warn(`Cannot hide overlay. Overlay "${name}" is not visible`);
    }
  }

  isRoute(route) {
    return this.route === route;
  }
}

function isScene(componentId) {
  const isWidget = componentId.indexOf('widget-') === 0;
  const isOverlay = componentId.indexOf('overlay-') === 0;

  return !isWidget && !isOverlay;
}

function throwNotSupported(navigator, method) {
  if (__DEV__) {
    throw new Error(
      `${navigator.constructor.name} does not support \`${method}\``,
    );
  }
}
