import { Navigation } from 'react-native-navigation';

import { Component, SideMenuNavigator } from './wix';

export default class DrawerNavigator extends SideMenuNavigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    // TODO
    // https://reactnavigation.org/docs/drawer-navigator#props
    // this.initialRouteName =
    // this.screenOptions =
    // this.backBehavior =
    // this.drawerPosition =
    // this.drawerType =
    // this.edgeWidth =
    // this.hideStatusBar =
    // this.statusBarAnimation =
    // this.keyboardDismissMode =
    // this.minSwipeDistance =
    // this.overlayColor =
    // this.gestureHandlerProps =
    // this.lazy =
    // this.sceneContainerStyle =
    // this.drawerStyle =
    // this.drawerContent =
    // this.drawerContentOptions =
  }

  openDrawer() {
    Navigation.mergeOptions(
      this.drawer.id,
      getVisibleLayout(this.drawerPosition, true),
    );
  }

  closeDrawer() {
    Navigation.mergeOptions(
      this.drawer.id,
      getVisibleLayout(this.drawerPosition, false),
    );
  }

  toggleDrawer() {
    if (this.visible) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }
}

function getVisibleLayout(position, visible) {
  const layout = {
    [position]: { visible },
  };

  return { sideMenu: layout };
}
