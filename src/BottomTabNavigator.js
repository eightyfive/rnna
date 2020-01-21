import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class BottomTabNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.layoutId = config.layoutId || this.order.join('-');
    this.tabIndex = 0;

    this.options = config.options;
  }

  getLayout() {
    const layout = {
      id: this.layoutId,
      name: this.layoutId,
      children: this.order.map(key => this.getRoute(key).getInitialLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  get routeName() {
    return this.order[this.tabIndex];
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  navigate(route, params, fromId) {
    const name = this.getRouteNavigator(route);
    const index = this.order.findIndex(key => key === name);

    if (index === -1) {
      throw new Error(`Unknown tab: ${name}`);
    }

    if (this.tabIndex !== index) {
      this.tabIndex = index;

      Navigation.mergeOptions(this.layoutId, {
        bottomTabs: { currentTabIndex: index },
      });
    }

    const rest = this.getRouteNext(route);

    if (rest) {
      this.active.navigate(rest, params, fromId);
    }
  }

  goBack(fromId) {
    // TODO
  }
}
