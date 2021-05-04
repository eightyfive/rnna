import { Navigation } from 'react-native-navigation';
import ModalNavigator from '@rnna/navigator/ModalNavigator';
import OverlayNavigator from '@rnna/navigator/OverlayNavigator';
import SwitchNavigator from '@rnna/navigator/SwitchNavigator';

export default class RootNavigator extends SwitchNavigator {
  constructor(config = {}) {
    super(config);

    this.backBehavior = 'none'; // Force
    this.overlayNames = [];

    this.addListener('ModalDismissed', this.handleModalDismissed);
    this.addListener('AppLaunched', this.handleAppLaunched);
  }

  handleModalDismissed = () => {
    const navigator = this.getCurrentRoute();

    if (navigator instanceof ModalNavigator) {
      this.history.pop();
      this.routeName = Array.from(this.history).pop();
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

    if (this.routeName !== name) {
      navigator = this.getRoute(name);

      const isOverlay = navigator instanceof OverlayNavigator;
      const isModal = navigator instanceof ModalNavigator;

      const currentRoute = this.getCurrentRoute();

      if (isOverlay) {
        this.overlayNames.push(name);
      } else if (isModal) {
        // Only one modal at a time
        if (currentRoute instanceof ModalNavigator) {
          this.dismissModal();
        }

        this.history.push(name);
      } else {
        // Unmount old route
        if (currentRoute) {
          currentRoute.unmount();
        }

        this.history = [name];
      }

      this.routeName = name;

      navigator.mount(props);
    }

    // Grab new current navigator (if changed)
    navigator = this.getCurrentRoute();
    navigator.render(rest, props);
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
    this.routeName = Array.from(this.history).pop();
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
