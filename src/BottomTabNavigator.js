import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class BottomTabNavigator extends Navigator {
  constructor(navigators, bottomTabs, config = {}) {
    super();

    this.navigators = navigators;

    this.bottomTabs = bottomTabs;
    this.order = config.order || this.bottomTabs.getOrder();
    this.initialComponentId = config.initialRouteName || this.order[0];
    this.tabIndex = 0;
  }

  get active() {
    return this.navigators[this.tabIndex];
  }

  mount() {
    Navigation.setRoot({ root: this.bottomTabs.getLayout() });
  }

  navigate(route, params, fromId) {
    const tabId = this.getRouteNavigator(route);
    const index = this.getTabIndex(tabId);

    if (this.tabIndex !== index) {
      this.tabIndex = index;

      const layoutId = this.bottomTabs.id;

      Navigation.mergeOptions(layoutId, {
        bottomTabs: { currentTabIndex: index },
      });
    }

    const rest = this.getRouteNext(route);

    if (rest) {
      this.active.navigate(rest, params, fromId);
    }
  }

  goBack() {
    // TODO
  }

  getTabIndex(name) {
    const index = this.navigators.findIndex(
      navigator => navigator.name === name,
    );

    if (index === -1) {
      throw new Error(`Unknown bottomTabs tab: ${name}`);
    }

    return index;
  }
}
