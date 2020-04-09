import { Navigation } from 'react-native-navigation';

import Component from './Component';
import StackNavigator from './StackNavigator';

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

    this.addListener('_didAppear', this.handleDidAppear);
    this.addListener('_didDisappear', this.handleDidDisappear);

    this.subscriptions[
      '_didAppear'
    ] = Navigation.events().registerComponentDidAppearListener(ev =>
      this.trigger('_didAppear', ev),
    );

    this.subscriptions[
      '_didDisappear'
    ] = Navigation.events().registerComponentDidDisappearListener(ev =>
      this.trigger('_didDisappear', ev),
    );
  }

  handleDidAppear = ({ componentId: id }) => {
    if (id === this.drawer.id) {
      this.visible = true;
    }
  };

  handleDidDisappear = ({ componentId: id }) => {
    if (id === this.drawer.id) {
      this.visible = false;
    }
  };

  mount(params) {
    Navigation.setRoot({ root: this.getInitialLayout(params) });
  }

  getLayout(params, routeName) {
    const layout = {
      center: super.getLayout(params, routeName),
      [this.drawerPosition]: this.drawer.getLayout(params),
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
