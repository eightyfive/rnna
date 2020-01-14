import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';

const events = Navigation.events();

export default class DrawerNavigator extends StackNavigator {
  constructor(routes, drawer, config = {}) {
    super(routes, config);

    this.drawer = drawer;
    this.side = config.side || 'left';
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

    Navigation.setRoot({ root: this.getLayout(this.initialRouteName) });
  }

  getLayout(componentId) {
    const layout = {
      center: super.getLayout(componentId),
      [this.side]: this.drawer.getLayout(),
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
      [this.side]: { visible },
    };

    return { sideMenu: layout };
  }
}
