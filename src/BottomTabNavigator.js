import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class BottomTabNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.layoutId = config.layoutId || this.order.join('-');
    this.tabIndex = 0;

    this.options = config.options;

    this.tabSelectedListener = events.registerBottomTabSelectedListener(
      this.handleBottomTabSelected,
    );
  }

  handleBottomTabSelected = ({ selectedTabIndex: index }) => {
    if (this.tabIndex !== index) {
      this.tabIndex = index;
    }
  };

  getLayout() {
    const layout = {
      id: this.layoutId,
      name: this.layoutId,
      children: this.order.map(key => this.get(key).getInitialLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  get(index) {
    if (typeof index === 'number') {
      const name = this.order[index];

      return this.routes[name];
    }

    return super.get(index);
  }

  get route() {
    const name = this.order[this.tabIndex];

    return this.get(name);
  }

  mount() {
    Navigation.setRoot({ root: this.getLayout() });
  }

  go(path, params, fromId) {
    const name = this.getPathNavigator(path);
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

    const rest = this.getNextPath(path);

    if (rest) {
      this.route.go(rest, params, fromId);
    }
  }

  goBack(fromId) {
    // TODO
  }
}
