import React from 'react';
import { Navigation } from 'react-native-navigation';

import SwitchNavigator from './SwitchNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

const events = Navigation.events();

const onDidAppear = events.registerComponentDidAppearListener;
const onModalDismiss = events.registerModalDismissedListener;

export default class RootNavigator extends SwitchNavigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.backBehavior = 'none'; // Force
    this.overlays = [];
    this.fromId = this.initialRouteName;

    this.overlayIds = Object.keys(routes)
      .filter(name => routes[name] instanceof OverlayNavigator)
      .map(name => name);

    const events = Navigation.events();

    this.addListener('_didAppear', this.handleDidAppear);
    this.addListener('_modalDismiss', this.handleModalDismiss);

    this.subscriptions['_didAppear'] = onDidAppear(ev =>
      this.trigger('_didAppear', ev),
    );

    this.subscriptions['_modalDismiss'] = onModalDismiss(ev =>
      this.trigger('_modalDismiss', ev),
    );

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
    }
  };

  handleModalDismiss = ({ componentId: id, modalsDismissed }) => {
    // Happens when Native back button is pressed.

    if (this.route instanceof ModalNavigator && this.route.name === id) {
      this.history.pop();
    }
  };

  launch() {
    return this.launched;
  }

  remount() {
    this.history.forEach(name => this.get(name).mount());

    this.overlays.forEach(name => this.get(name).mount());
  }

  navigate(path, params) {
    const [name, rest] = this.parsePath(path);
    const route = this.get(name);

    const isOverlay = route instanceof OverlayNavigator;

    if (isOverlay) {
      this.overlays.push(route.name);

      route.mount(params);
      return;
    }

    if (!this.route) {
      this.history = [name];

      route.mount(params);
    } else if (this.route.name !== name) {
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
      this.route.navigate(rest, params, this.fromId);
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

  onDismissOverlay(name) {
    this.overlays = this.overlays.filter(id => id === name);
  }

  isScene(id) {
    const isWidget = id.indexOf('widget-') === 0;

    return !isWidget && !this.overlayIds.includes(id);
  }

  register(screens, Provider = null, store = null) {
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
  }

  getComponent() {
    if (!this.route) {
      return null;
    }

    return this.route.getComponent();
  }
}
