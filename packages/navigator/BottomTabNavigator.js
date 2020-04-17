import { Navigation } from 'react-native-navigation';

import { BottomTabsNavigator } from './wix';

export default class BottomTabNavigator extends BottomTabsNavigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    // TODO
    // https://reactnavigation.org/docs/bottom-tab-navigator/#props
    // this.initialRouteName =
    // this.screenOptions =
    // this.backBehavior =
    // this.lazy =
    // this.tabBar =
    // this.tabBarOptions =
  }
}
