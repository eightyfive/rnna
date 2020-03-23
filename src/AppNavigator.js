import React from 'react';
import { Navigation } from 'react-native-navigation';

import SwitchNavigator from './SwitchNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

export default class AppNavigator extends SwitchNavigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = 'none'; // Force
    this.mainName = null;
    this.modalName = null;
    this.overlays = [];
    this.fromId = this.initialRouteName;
    this.onMounted = [];
    this.onTabSelected = [];
    this.onTabPressed = [];

    this.overlayIds = Object.keys(routes)
      .filter(name => routes[name] instanceof OverlayNavigator)
      .map(name => name);

    this.didAppearListener = events.registerComponentDidAppearListener(
      this.handleDidAppear,
    );

    this.modalDismissedListener = events.registerModalDismissedListener(
      this.handleModalDismissed,
    );

    this.tabSelectedListener = events.registerBottomTabSelectedListener(
      this.handleBottomTabSelected,
    );

    this.tabPressedListener = events.registerBottomTabPressedListener(
      this.handleBottomTabPressed,
    );

    this.launch();
  }

  launch() {
    this.launched = new Promise(resolve => {
      const launchedListener = events.registerAppLaunchedListener(() => {
        launchedListener.remove();
        resolve();
      });
    });
  }

  handleDidAppear = ({ componentId }) => {
    if (this.isScene(componentId)) {
      this.fromId = componentId;

      // console.log('did APPEAR:', componentId);
    }
  };

  handleModalDismissed = ({ componentId, modalsDismissed }) => {
    // console.log('modal Dismissed:', componentId, modalsDismissed);

    // Happens when Native back button is pressed.
    // We need to remove/"pop" the top-most modal
    if (this.modalName === componentId) {
      this.modalName = null;
    }
  };

  handleBottomTabSelected = ev =>
    Promise.all(this.onTabSelected.map(cb => cb(ev)));

  handleBottomTabPressed = ev =>
    Promise.all(this.onTabPressed.map(cb => cb(ev)));

  onAppMounted(cb) {
    this.onMounted.push(cb);
  }

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  onBottomTabPressed(cb) {
    this.onTabPressed.push(cb);
  }

  mount() {
    super.mount();

    this.onMounted.forEach(cb => cb());
  }

  remount() {
    if (this.main) {
      this.main.mount();
    }

    if (this.modal) {
      this.modal.mount();
    }

    this.overlays.forEach(name => this.getRoute(name).mount());
  }

  get routeName() {
    return this.modalName || this.mainName;
  }

  get main() {
    return this.routes[this.mainName];
  }

  get modal() {
    return this.routes[this.modalName];
  }

  isVisible(name) {
    return name === this.routeName || this.overlays.some(ov => ov === name);
  }

  navigate(route, params, fromId) {
    const name = this.getRouteNavigator(route);

    if (this.routeName !== name) {
      // Force dissmiss modal (1 modal maximum at a time)
      if (this.modal) {
        this.dismissModal();
      }

      const active = this.getRoute(name);
      const isModal = active instanceof ModalNavigator;

      if (isModal) {
        this.modalName = name;
      } else {
        if (this.main) {
          this.main.unmount(this.fromId);
        }

        this.mainName = name;
      }

      // Mount
      active.mount();
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
      if (this.modal) {
        this.dismissModal();
      }
    }
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

  dismissModal() {
    this.modal.unmount(this.fromId);
    this.modalName = null;
  }

  dismissAllModals() {
    if (this.modal) {
      Navigation.dismissAllModals();
    }
  }

  dismissAllOverlays() {
    this.overlays.forEach(name => this.getRoute(name).unmount());
    this.overlays = [];
  }

  isComponentId(id) {
    return this.fromId === id;
  }

  showOverlay(name) {
    const overlay = this.getRoute(name);

    if (!(overlay instanceof OverlayNavigator)) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    overlay.mount();

    this.overlays.push(name);
  }

  dismissOverlay(name) {
    const index = this.overlays.findIndex(ov => ov === name);
    const visible = index !== -1;

    if (visible) {
      const [ov] = this.overlays.splice(index, 1);

      this.getRoute(ov).unmount();
    } else {
      throw new Error(`Overlay "${name}" is not visible`);
    }
  }

  isScene(componentId) {
    const isWidget = componentId.indexOf('widget-') === 0;

    return !isWidget && !this.overlayIds.includes(componentId);
  }

  run(screens, Provider = null, store = null) {
    Object.keys(screens).forEach(componentId => {
      const Screen = screens[componentId];

      if (Provider) {
        Navigation.registerComponent(
          componentId,
          () => props => (
            <Provider {...{ store }}>
              <Screen {...props} />
            </Provider>
          ),
          () => Screen,
        );
      } else {
        Navigation.registerComponent(componentId, () => Screen);
      }
    });

    this.launched.then(() => this.init());
  }

  init() {
    this.mount();
    this.remountListener = events.registerAppLaunchedListener(() =>
      this.remount(),
    );
  }
}
