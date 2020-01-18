import { Navigation } from 'react-native-navigation';

import Component from './Component';
import StackNavigator from './StackNavigator';

const events = Navigation.events();

export default class DrawerNavigator extends StackNavigator {
  constructor(routes, config = {}) {
    if (!config.drawer) {
      throw new Error('config.drawer is required');
    }

    if (!(config.drawer instanceof Component)) {
      throw new Error('config.drawer must be of type `Component`');
    }

    super(routes, config);

    this.drawer = config.drawer;
    this.drawerPosition = config.drawerPosition || 'left';
    this.visible = false;
    this.options = config.options;

    this.didAppearListener = events.registerComponentDidAppearListener(
      this.handleDidAppear,
    );

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear,
    );
  }

  handleDidAppear = ({ componentId }) => {
    if (componentId === this.drawer.id) {
      this.visible = true;
    }
  };

  handleDidDisappear = ({ componentId }) => {
    if (componentId === this.drawer.id) {
      this.visible = false;
    }
  };

  mount() {
    this.history = [this.initialRouteName];

    Navigation.setRoot({ root: this.getInitialLayout() });
  }

  getLayout(routeName) {
    const layout = {
      center: super.getLayout(routeName),
      [this.drawerPosition]: this.drawer.getLayout(),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { sideMenu: layout };
  }

  navigate(toId, params) {
    if (toId === this.drawer.id) {
      this.openDrawer();
    } else {
      if (this.visible) {
        this.closeDrawer();
      }

      // StackNavigator.push
      super.navigate(toId, params, this.initialRouteName);
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
    Navigation.mergeOptions(this.drawer.id, this.getVisibleLayout(true));
  }

  closeDrawer() {
    Navigation.mergeOptions(this.drawer.id, this.getVisibleLayout(false));
  }

  toggleDrawer() {
    if (this.visible) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  getVisibleLayout(visible) {
    const layout = {
      [this.drawerPosition]: { visible },
    };

    return { sideMenu: layout };
  }
}
