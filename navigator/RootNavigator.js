import React from 'react';
import { Navigation } from 'react-native-navigation';
import _pullAt from 'lodash.pullat';

import SwitchNavigator from './SwitchNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

export default class RootNavigator extends SwitchNavigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = 'none'; // Force
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

  handleDidAppear = ({ componentId: id }) => {
    if (this.isScene(id)) {
      this.fromId = id;

      // console.log('did APPEAR:', id);
    }
  };

  handleModalDismissed = ({ componentId: id, modalsDismissed }) => {
    // console.log('modal Dismissed:', id, modalsDismissed);

    // Happens when Native back button is pressed.

    if (this.route instanceof ModalNavigator && this.route.name === id) {
      this.history.pop();
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

  remount() {
    this.history.forEach(name => this.get(name).mount());

    this.overlays.forEach(name => this.get(name).mount());
  }

  go(path, params) {
    const [name, rest] = this.parsePath(path);
    const route = this.get(name);

    const mounted = this.route !== null;
    const active = this.route.name === name;

    if (!mounted) {
      this.history = [name];

      route.mount(params);
    } else if (!active) {
      if (this.route instanceof ModalNavigator) {
        // Only one modal at a time
        this.dismissModal();
        this.history.push(name);
      } else {
        // Unmount old route
        this.route.unmount(this.fromId);
        this.history = [name];
      }

      route.mount(params);
    }

    if (rest) {
      this.route.go(rest, params, this.fromId);
    }
  }

  goBack() {
    try {
      this.route.goBack(this.fromId);
    } catch (err) {
      if (this.route instanceof ModalNavigator) {
        this.dismissModal();
      }
    }
  }

  openDrawer() {
    this.route.openDrawer();
  }

  closeDrawer() {
    this.route.closeDrawer();
  }

  toggleDrawer() {
    this.route.toggleDrawer();
  }

  dismissModal() {
    if (!(this.route instanceof ModalNavigator)) {
      throw new Error('No modal to dismiss');
    }

    this.route.unmount(this.fromId);
    this.history.pop();
  }

  dismissAllModals() {
    if (this.route instanceof ModalNavigator) {
      Navigation.dismissAllModals();
    }
  }

  dismissAllOverlays() {
    this.overlays.forEach(name => this.get(name).unmount());
    this.overlays = [];
  }

  isComponentId(id) {
    return this.fromId === id;
  }

  showOverlay(name, params) {
    const overlay = this.get(name);

    if (!(overlay instanceof OverlayNavigator)) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    overlay.mount(params);

    this.overlays.push(name);
  }

  dismissOverlay(name) {
    const index = this.overlays.findIndex(id => id === name);
    const visible = index !== -1;

    if (visible) {
      const [id] = _pullAt(this.overlays, index);

      this.get(id).unmount();
    } else {
      throw new Error(`Overlay "${name}" is not visible`);
    }
  }

  isScene(id) {
    const isWidget = id.indexOf('widget-') === 0;

    return !isWidget && !this.overlayIds.includes(id);
  }

  run(screens, Provider = null, store = null) {
    Object.keys(screens).forEach(name => {
      const Screen = screens[name];

      if (Provider) {
        Navigation.registerComponent(
          name,
          () => props => (
            <Provider {...{ store }}>
              <Screen {...props} />
            </Provider>
          ),
          () => Screen,
        );
      } else {
        Navigation.registerComponent(name, () => Screen);
      }
    });

    // this.launched.then(() => this.init());
  }

  // init() {
  //   this.mount();
  //   this.remountListener = events.registerAppLaunchedListener(() =>
  //     this.remount(),
  //   );
  // }
}
