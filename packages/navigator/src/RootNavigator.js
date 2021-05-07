import { Navigation } from 'react-native-navigation';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import SwitchNavigator from './SwitchNavigator';

export default class RootNavigator extends SwitchNavigator {
  constructor(config = {}) {
    super(config);

    this.overlayNames = [];

    this.addListener('ModalDismissed', this.handleModalDismissed);
    this.addListener('AppLaunched', this.handleAppLaunched);
  }

  handleModalDismissed = () => {
    const navigator = this.getCurrentRoute();

    if (navigator instanceof ModalNavigator) {
      this.history.pop();
    }
  };

  handleAppLaunched = () => this.remount();

  addModal(name, navigator) {
    if (!(navigator instanceof ModalNavigator)) {
      throw new Error('Root route must be a `ModalNavigator` instance');
    }

    this.routes.set(name, navigator);
  }

  addOverlay(name, navigator) {
    if (!(navigator instanceof OverlayNavigator)) {
      throw new Error('Root route must be an `OverlayNavigator` instance');
    }

    this.routes.set(name, navigator);
  }

  remount() {
    this.history.forEach(name => this.getRoute(name).mount());

    this.overlayNames.forEach(name => this.getRoute(name).mount());
  }

  render(path, props) {
    const [name, childPath] = this.readPath(path);

    let navigator = this.getRoute(name);

    if (navigator instanceof OverlayNavigator) {
      this.renderOverlay(name, childPath, props);
    } else if (navigator instanceof ModalNavigator) {
      this.renderModal(name, childPath, props);
    } else {
      this.dismissModal(false);

      super.render(path, props);
    }
  }

  renderModal(name, childPath, props) {
    let navigator;

    if (this.history.isCurrent(name)) {
      navigator = this.getCurrentRoute();
    } else {
      // Only one modal at a time
      this.dismissModal(false);

      this.history.push(name);

      // Mount modal
      navigator = this.getCurrentRoute();
      navigator.mount(props);
    }

    navigator.render(childPath, props);
  }

  renderOverlay(name, childPath, props) {
    const found = this.overlayNames.find(val => val === name);

    const navigator = this.getRoute(name);

    if (found) {
      navigator.render(childPath, props);
    } else {
      this.overlayNames.push(name);

      navigator.mount(props);
    }
  }

  goBack() {
    const navigator = this.getCurrentRoute();

    try {
      navigator.goBack();
    } catch (err) {
      this.dismissModal(false);
    }
  }

  dismissModal(strict = true) {
    const navigator = this.getCurrentRoute();

    const isModal = navigator instanceof ModalNavigator;

    if (strict && !isModal) {
      throw new Error('No modal to dismiss');
    }

    if (isModal) {
      navigator.unmount();

      this.history.pop();
    }
  }

  dismissAllModals() {
    const navigator = this.getCurrentRoute();

    if (navigator instanceof ModalNavigator) {
      Navigation.dismissAllModals();
    }
  }

  dismissOverlay(overlayName) {
    const navigator = this.getRoute(overlayName);

    if (!(navigator instanceof OverlayNavigator)) {
      throw new Error(`Overlay not found: ${overlayName}`);
    }

    this.overlayNames = this.overlayNames.filter(name => name !== overlayName);

    navigator.dismiss();
  }
}