import { Component, BottomTabs, Modal, Overlay, Stack } from './Layouts';
import Router from './Router';

export default class SwitchRouter extends Router {
  constructor(layouts, config = {}) {
    super(layouts, config);

    const notAllowed = Array.from(this.layouts.values()).some(
      layout => layout instanceof Modal || layout instanceof Overlay,
    );

    if (notAllowed.length) {
      throw new TypeError('Invalid argument');
    }

    this.addListener('AppLaunched', this.handleAppLaunched);
  }

  handleAppLaunched = () => this.remount();

  remount() {
    this.history.forEach(name => this.layouts.get(name).mount());
  }

  render(componentId, props) {
    const [name, childName] = this.readPath(componentId);

    let layout;

    if (this.name !== name) {
      // Unmount old layout
      layout = this.layouts.get(this.name);

      if (layout) {
        layout.unmount();
      }

      this.history.push(name);

      // Mount new layout
      layout = this.layouts.get(this.name);
      layout.mount(props);
    } else if (layout instanceof Component) {
      layout.update(props);
    }

    if (childName) {
      if (layout instanceof BottomTabs) {
        this.renderBottomTabs(layout, childName, props);
      }

      if (layout instanceof Stack) {
        this.renderStack(layout, childName, props);
      }
    }
  }

  goBack() {
    const layout = this.layouts.get(this.name);

    if (layout instanceof BottomTabs) {
      this.goBackBottomTabs(layout);
    }

    if (layout instanceof Stack) {
      this.goBackStack(layout);
    }
  }
}
