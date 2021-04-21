import _last from 'lodash.last';
import { Navigation } from 'react-native-navigation';
import ModalNavigator from '@rnna/navigator/ModalNavigator';
import OverlayNavigator from '@rnna/navigator/OverlayNavigator';
import SwitchNavigator from '@rnna/navigator/SwitchNavigator';

export default class RootNavigator extends SwitchNavigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    this.backBehavior = 'none'; // Force
    this.overlays = [];
    this.overlayIds = [];

    for (const [id, route] of this.routes) {
      if (route instanceof OverlayNavigator) {
        this.overlayIds.push(id);
      }
    }

    this.addListener('ModalDismissed', this.handleModalDismissed);
    this.addListener('AppLaunched', this.handleAppLaunched);
  }

  handleModalDismissed = () => {
    if (this.route instanceof ModalNavigator) {
      this.history.pop();
    }
  };

  handleAppLaunched = () => this.remount();

  remount() {
    this.history.forEach(id => this.get(id).mount());

    this.overlays.forEach(id => this.get(id).mount());
  }

  navigate(path, props) {
    const [id, rest] = this.parsePath(path);
    const route = this.get(id);

    if (!this.route || (this.route && this.route.id !== route.id)) {
      const isOverlay = route instanceof OverlayNavigator;
      const isModal = route instanceof ModalNavigator;

      if (isOverlay) {
        this.overlays.push(route.id);
      } else if (isModal) {
        // Only one modal at a time
        if (this.route instanceof ModalNavigator) {
          this.dismissModal();
        }

        this.history.push(route.id);
      } else {
        // Unmount old route
        if (this.route) {
          this.route.unmount();
        }

        this.history = [route.id];
      }

      route.mount(props);
    }

    if (rest) {
      this.route.navigate(rest, props);
    }
  }

  goBack() {
    try {
      this.route.goBack();
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

    this.route.unmount();
    this.history.pop();
  }

  dismissAllModals() {
    if (this.route instanceof ModalNavigator) {
      Navigation.dismissAllModals();
    }
  }

  isScene(id) {
    const isWidget = id.indexOf('widget-') === 0;

    return !isWidget && !this.overlayIds.includes(id);
  }

  get overlay() {
    const id = _last(this.overlays);

    if (id) {
      return this.get(id);
    }

    return null;
  }

  getComponent() {
    return this.overlay ? this.overlay.getComponent() : super.getComponent();
  }

  onDismissOverlay(componentId) {
    this.overlays = this.overlays.filter(id => id !== componentId);
  }
}
