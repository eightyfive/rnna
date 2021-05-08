import { Navigation } from 'react-native-navigation';

import Component from './Component';
import Stack from './Stack';

export default class SideMenu extends Stack {
  constructor(components, config = {}) {
    if (!config.left && !config.right) {
      throw new Error('config.left or config.right menu is required');
    }

    if (config.left && !(config.left instanceof Component)) {
      throw new TypeError('Invalid config.left');
    }

    if (config.right && !(config.right instanceof Component)) {
      throw new TypeError('Invalid config.right');
    }

    super(components, config);

    this.left = config.left || null;
    this.right = config.right || null;
    this.side = this.left && this.right ? 'both' : this.left ? 'left' : 'right';
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getInitialLayout(initialProps) });
  }

  getLayout(props, componentName) {
    const layout = {
      center: super.getLayout(props, componentName),
      options: { ...this.options },
    };

    if (this.left) {
      layout.left = this.left.getLayout();
    }

    if (this.right) {
      layout.right = this.right.getLayout();
    }

    return { sideMenu: layout };
  }

  open(side) {
    this.setVisible(side, true);
  }

  close(side) {
    this.setVisible(side, false);
  }

  setVisible(side, visible) {
    let menu;

    if (side) {
      menu = this[side];

      if (!menu) {
        throw new Error(`Side menu ${side} does not exist`);
      }
    } else {
      if (this.side === 'both') {
        throw new Error(`Specify side menu left or right`);
      }

      menu = this[this.side];
    }

    Navigation.mergeOptions(menu.id, {
      sideMenu: {
        [side]: { visible },
      },
    });
  }
}
