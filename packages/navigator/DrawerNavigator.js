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

  navigate(toId, params) {
    if (toId === this.drawer.id) {
      this.openDrawer();
    } else {
      if (this.visible) {
        this.closeDrawer();
      }

      // TODO
      // Exactly the same as StackNavigator.navigate...
      const index = this.history.findIndex(name => name === toName);

      if (index === -1) {
        this.push(toName, params, fromId);
      } else if (index >= 1) {
        this.popToIndex(index);
      }
    }
  }

  goBack() {
    if (this.visible) {
      this.closeDrawer();
    } else {
      // TODO
      // Exactly the same as StackNavigator.goBack...
      if (this.history.length === 1) {
        throw new Error('No route to navigate back to');
      }

      this.history.pop();
      this.pop();
    }
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
