import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class OverlayNavigator extends Navigator {
  constructor(config = {}) {
    super({}, config.options || {}, config);

    this.components = new Map();
  }

  addRoute(name, route) {
    this.addComponent(name, route);
  }

  addComponent(name, component) {
    if (this.components.size === 1) {
      throw new Error('OverlayNavigator may not have more than one route');
    }

    this.components.set(name, component);
    this.componentName = name;
  }

  mount(initialProps) {
    const component = this.components.get(this.componentName);

    Navigation.showOverlay(component.getLayout(initialProps));
  }

  unmount() {
    this.dismiss();
  }

  dismiss() {
    const component = this.components.get(this.componentName);

    Navigation.dismissOverlay(component.id);

    if (this.parent) {
      this.parent.onDismissOverlay(this.id);
    }
  }

  render(path, props) {
    this.mount(props);
  }

  goBack() {
    this.unmount();
  }
}
