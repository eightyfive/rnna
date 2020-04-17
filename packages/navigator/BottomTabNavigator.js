import { Navigation } from 'react-native-navigation';

import { BottomTabsNavigator } from './wix';

export default class BottomTabNavigator extends BottomTabsNavigator {
  constructor(routes, config = {}) {
    super(routes, config);

    // TODO
    // https://reactnavigation.org/docs/bottom-tab-navigator/#props
    // this.initialRouteName =
    // this.screenOptions =
    // this.backBehavior =
    // this.lazy =
    // this.tabBar =
    // this.tabBarOptions =
  }

  navigate(path, params, fromId) {
    const [id, rest] = this.parsePath(path);
    const index = this.order.findIndex(key => key === id);

    if (index === -1) {
      throw new Error(`Unknown tab: ${id}`);
    }

    if (this.tabIndex !== index) {
      this.tabIndex = index;

      Navigation.mergeOptions(this.layoutId, {
        bottomTabs: { currentTabIndex: index },
      });
    }

    if (rest) {
      this.route.navigate(rest, params, fromId);
    }
  }

  goBack(fromId) {
    // TODO
  }
}
