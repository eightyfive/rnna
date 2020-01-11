import Component from './Component';
import Stack from './Stack';

export default class SideMenu {
  constructor(menu, center, options, config = {}) {
    this.menu = menu;
    this.center = center;
    this.options = options;
    this.side = config.side || 'left';

    if (!(menu instanceof Component)) {
      throw new Error('SideMenu: Left/Right must be `Component`');
    }

    if (!(center instanceof Stack)) {
      throw new Error('SideMenu: Center must be `Stack`');
    }
  }

  getLayout(componentId = null) {
    const layout = {
      center: this.center.getLayout(componentId),
      [this.side]: this.menu.getLayout(),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { sideMenu: layout };
  }

  getVisibleLayout(visible) {
    const layout = {
      [this.side]: { visible },
    };

    return { sideMenu: layout };
  }
}
