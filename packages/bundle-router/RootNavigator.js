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
    const [name, rest] = this.parsePath(path);

    let navigator;

    if (!this.history.is(name)) {
      navigator = this.getRoute(name);

      if (navigator instanceof OverlayNavigator) {
        this.renderOverlay(name, props);
        this.overlayNames.push(name);
      } else if (navigator instanceof ModalNavigator) {
        this.renderModal(name);
      } else {
        this.renderMain(name, props);
      }
    }

    if (rest) {
      // Grab new current navigator (may have changed)
      navigator = this.getCurrentRoute();
      navigator.render(rest, props);
    }
  }

  renderModal(name, props) {
    let navigator = this.getCurrentRoute();

    // Only one modal at a time
    if (navigator instanceof ModalNavigator) {
      this.dismissModal();
    }

    this.history.push(name);

    navigator = this.getCurrentRoute();
    navigator.mount(props);
  }

  renderMain(name, props) {
    let navigator = this.getCurrentRoute();

    // Only one main navigator at a time
    if (navigator) {
      navigator.unmount();
    }

    this.history.reset(name);

    navigator = this.getCurrentRoute();
    navigator.mount(props);
  }

  renderOverlay(name, props) {
    const overlayName = this.overlayNames.find(val => val === name);

    let navigator;

    if (overlayName) {
      navigator = this.getRoute(overlayName);
      navigator.update(props);
    } else {
      this.overlayNames.push(name);

      navigator = this.getRoute(name);
      navigator.mount(props);
    }
  }

  goBack() {
    const navigator = this.getCurrentRoute();

    try {
      navigator.goBack();
    } catch (err) {
      if (navigator instanceof ModalNavigator) {
        this.dismissModal();
      }
    }
  }

  dismissModal() {
    const navigator = this.getCurrentRoute();

    if (!(navigator instanceof ModalNavigator)) {
      throw new Error('No modal to dismiss');
    }

    navigator.unmount();

    this.history.pop();
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
