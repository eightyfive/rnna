import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

export default class AppNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.route = null;
    this.mounted = false;

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
    this.history.forEach(name => this.getNavigator(name).mount());
    this.overlays.forEach(name => this.getNavigator(name).mount());
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
    this.history = this.history.filter(
      // navigator instanceof ModalNavigator
      name => name !== componentId,
    );
  };

  handleBottomTabSelected = ev =>
    Promise.all(this.onTabSelected.map(handler => handler(ev)));

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  get main() {
    const name = this.history[0];

    return this.routes[name];
  }

  get modal() {
    if (this.history.length > 1) {
      const name = this.history[1];

      return this.routes[name];
    }

    return null;
  }

  get active() {
    return this.modal || this.main;
  }

  isVisible(name) {
    return name === this.routeName || this.overlays.some(ov => ov === name);
  }

  navigate(route, params) {
    if (!this.mounted) {
      throw new Error('RNN not mounted yet');
    }

    this.route = route;

    const name = this.getRouteNavigator(route);

    if (name !== this.routeName) {
      // Unmount modal
      if (this.modal) {
        this.modal.unmount(this.fromId);
        this.history.pop(); // [main]
      }

      const navigator = this.getNavigator(name);

      // Unmount main ?
      if (this.main && !this.modal && !(navigator instanceof ModalNavigator)) {
        this.main.unmount(this.fromId);
        this.history.pop(); // []
      }

      // Mount
      navigator.mount();
      this.history.push(name);
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
        this.history.pop();
      }
    }
  }

  push(name, params) {
    this.active.push(name, params, this.fromId);
  }

  pop(n = 1) {
    this.active.pop(n);
  }

  popToTop() {
    this.active.popToTop(this.fromId);
  }

  popToIndex(index) {
    this.active.popToIndex(index);
  }

  openDrawer() {
    this.active.openDrawer();
  }

  closeDrawer() {
    this.active.closeDrawer();
  }

  toggleDrawer() {
    this.active.toggleDrawer();
  }

  dismiss() {
    this.active.dismiss(this.fromId);
  }

  dismissAllModals() {
    const total = this.history.length;

    this.history = this.history.filter(name => {
      const navigator = this.getNavigator(name);

      return !(navigator instanceof ModalNavigator);
    });

    if (this.history.length < total) {
      Navigation.dismissAllModals();
    }
  }

  dismissAllOverlays() {
    this.overlays.forEach(name => this.getNavigator(name).unmount());
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
    const index = this.overlays.findIndex(ov => ov === name);
    const visible = index !== -1;

    if (visible) {
      const [ov] = this.overlays.splice(index, 1);

      this.getNavigator(ov).unmount();
    } else {
      throw new Error(`Overlay "${name}" is not visible`);
    }
  }
}

function isScene(componentId) {
  const isWidget = componentId.indexOf('widget-') === 0;
  const isOverlay = componentId.indexOf('overlay-') === 0;

  return !isWidget && !isOverlay;
}
