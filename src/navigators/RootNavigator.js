import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

export default class RootNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.route = null;
    this.mounted = false;

    this.stack = [];
    this.overlays = [];

    this.fromId = this.initialRouteName;
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
    if (this.mounted) {
      this.remount();
    } else {
      this.mount();
    }
  };

  mount() {
    this.mounted = true;
    this.navigate(this.initialRouteName);
    this.onLaunched.forEach(cb => cb());
  }

  remount() {
    this.stack.forEach(key => this.getNavigator(key).mount());
    this.overlays.forEach(key => this.getNavigator(key).mount());
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
      key => key !== componentId,
    );
  };

  handleBottomTabSelected = ev =>
    Promise.all(this.onTabSelected.map(handler => handler(ev)));

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  get main() {
    const name = this.stack[0];

    return this.routes[name];
  }

  get modal() {
    if (this.stack.length > 1) {
      const name = this.stack[1];

      return this.routes[name];
    }

    // return undefined;
  }

  get active() {
    return this.modal || this.main;
  }

  isActive(name) {
    const active = this.stack[this.stack.length - 1];

    return active === name;
  }

  isVisible(name) {
    return this.isActive(name) || this.overlays.some(key => key === name);
  }

  navigate(route, params) {
    if (!this.mounted) {
      throw new Error('RNN not mounted yet');
    }

    this.route = route;

    const name = this.getRouteNavigator(route);

    if (!this.isActive(name)) {
      // Unmount modal
      if (this.modal) {
        this.modal.unmount(this.fromId);
        this.stack.pop(); // [main]
      }

      const navigator = this.getNavigator(name);

      // Unmount main ?
      if (this.main && !this.modal && !(navigator instanceof ModalNavigator)) {
        this.main.unmount(this.fromId);
        this.stack.pop(); // []
      }

      // Mount
      navigator.mount();
      this.stack.push(name);
    }

    const next = this.getRouteNext(route);

    if (next) {
      this.active.navigate(next, params, this.fromId);
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

    this.stack = this.stack.filter(key => {
      const navigator = this.getNavigator(key);

      return !(navigator instanceof ModalNavigator);
    });

    if (this.stack.length < total) {
      Navigation.dismissAllModals();
    }
  }

  dismissAllOverlays() {
    this.overlays.forEach(key => this.getNavigator(key).unmount());
    this.overlays = [];
  }

  isComponentId(id) {
    return this.fromId === id;
  }

  showOverlay(name) {
    const overlay = this.getNavigator(name);

    if (!(overlay instanceof OverlayNavigator)) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    overlay.mount();

    this.overlays.push(name);
  }

  hideOverlay(name) {
    const index = this.overlays.findIndex(key => key === name);
    const visible = index !== -1;

    if (visible) {
      const [key] = this.overlays.splice(index, 1);

      this.getNavigator(key).unmount();
    } else if (__DEV__) {
      console.error(`Cannot hide overlay. Overlay "${name}" is not visible`);
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
