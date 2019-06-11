import StackNavigator from "./StackNavigator";

export default class DrawerNavigator extends StackNavigator {
  constructor(navigation, sideMenu, config = {}) {
    super(navigation, sideMenu.center, {});

    this.name = config.name;
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
    this.navigation.mergeOptions(
      this.drawer.id,
      this.sideMenu.getVisibleLayout(true)
    );

    this.visible = true;
  }

  closeDrawer() {
    this.navigation.mergeOptions(
      this.drawer.id,
      this.sideMenu.getVisibleLayout(false)
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
