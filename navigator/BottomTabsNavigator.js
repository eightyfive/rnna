import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

const events = Navigation.events();

export default class BottomTabsNavigator extends Navigator {
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

  getLayout(params) {
    const layout = {
      id: this.layoutId,
      name: this.layoutId,
      children: this.order.map(key => this.get(key).getInitialLayout(params)),
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

  mount(params) {
    Navigation.setRoot({ root: this.getLayout(params) });
  }

  go(path, params, fromId) {
    const [name, rest] = this.parsePath(path);
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

    if (rest) {
      this.route.go(rest, params, fromId);
    }
  }

  goBack(fromId) {
    // TODO
  }

  getComponent() {
    if (!this.route) {
      return null;
    }

    return this.route.getComponent();
  }
}
