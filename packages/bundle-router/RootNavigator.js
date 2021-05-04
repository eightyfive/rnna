import { Navigation } from 'react-native-navigation';
import ModalNavigator from '@rnna/navigator/ModalNavigator';
import OverlayNavigator from '@rnna/navigator/OverlayNavigator';
import SwitchNavigator from '@rnna/navigator/SwitchNavigator';

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

  remount() {
    this.history.forEach(name => this.getRoute(name).mount());

    this.overlayNames.forEach(name => this.getRoute(name).mount());
  }

  render(path, props) {
    const [name, rest] = this.splitPath(path);

    let navigator = this.getRoute(name);

    if (navigator instanceof OverlayNavigator) {
      this.renderOverlay(name, rest, props);
    } else if (navigator instanceof ModalNavigator) {
      this.renderModal(name, rest, props);
    } else {
      this.renderMain(name, rest, props);
    }
  }

  renderMain(name, rest, props) {
    let navigator;

    this.dismissModal(false);

    if (!this.history.isCurrent(name)) {
      // Only one main navigator at a time
      navigator = this.getCurrentRoute();
      navigator.unmount();

      this.history.reset(name);

      navigator = this.getCurrentRoute();
      navigator.mount(props);
    }

    navigator = this.getCurrentRoute();
    navigator.render(rest, props);
  }

  renderModal(name, rest, props) {
    let navigator;

    if (!this.history.isCurrent(name)) {
      // Only one modal at a time
      this.dismissModal(false);

      this.history.push(name);

      // Mount modal
      navigator = this.getCurrentRoute();
      navigator.mount(props);
    }

    navigator = this.getCurrentRoute();
    navigator.render(rest, props);
  }

  renderOverlay(name, rest, props) {
    const found = this.overlayNames.find(val => val === name);

    const navigator = this.getRoute(name);

    if (found) {
      navigator.render(rest, props);
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

  isScene(name) {
    const isWidget = id.indexOf('widget-') === 0;

    const navigator = this.getRoute(name);

    return !isWidget && !(navigator instanceof OverlayNavigator);
  }

  onDismissOverlay(componentId) {
    const componentName = this.findRouteNameById(componentId);

    this.overlayNames = this.overlayNames.filter(
      name => name !== componentName,
    );
  }
}
