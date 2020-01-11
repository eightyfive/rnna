import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

export default class DrawerNavigator extends StackNavigator {
  constructor(name, sideMenu, config = {}) {
    super(name, sideMenu.center, config);

    this.drawer = sideMenu.menu;
    this.sideMenu = sideMenu;
    this.visible = false;
  }

  getInitialLayout() {
    return this.sideMenu.getLayout(this.initialComponentId);
  }

  navigate(toId, params) {
    if (toId === this.drawer.id) {
      this.openDrawer();
    } else {
      if (this.visible) {
        this.closeDrawer();
      }

      // StackNavigator.push
      super.navigate(toId, params, this.initialComponentId);
    }
  }

  goBack(fromId) {
    if (this.visible) {
      this.closeDrawer();
    } else {
      super.goBack(fromId);
    }
  }

  openDrawer() {
    Navigation.mergeOptions(
      this.drawer.id,
      this.sideMenu.getVisibleLayout(true),
    );

    this.visible = true;
  }

  closeDrawer() {
    Navigation.mergeOptions(
      this.drawer.id,
      this.sideMenu.getVisibleLayout(false),
    );

    this.visible = false;
  }

  toggleDrawer() {
    if (this.visible) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }
}
