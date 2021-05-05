import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  addRoute(name, component) {
    if (this.routes.size === 1) {
      throw new Error('OverlayNavigator may not have more than one route');
    }

    if (!(component instanceof Component)) {
      throw new Error('Overlay route must be a `Component` instance');
    }

    super.addRoute(name, component);
  }

  getComponents() {
    const component = this.getRoute(this.initialRouteName);

    return [component];
  }

  mount(initialProps) {
    const component = this.getRoute(this.initialRouteName);

    Navigation.showOverlay(component.getLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    const component = this.getRoute(this.initialRouteName);

    Navigation.dismissOverlay(component.id);
  }

  render(path, props) {
    const component = this.getRoute(this.initialRouteName);

    component.render(props);
  }

  goBack() {
    this.unmount();
  }
}
