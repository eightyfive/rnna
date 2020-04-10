import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class BottomTabsNavigator extends Navigator {
  constructor(routes, config = {}) {
    super(routes, config);

    this.layoutId = config.layoutId || this.order.join('-');
    this.options = config.options;
    this.tabIndex = 0;

    this.listeners = {
      tabSelect: [],
      tabPress: [],
      tabLongPress: [],
    };

    this.addListener('tabSelect', this.handleTabSelect);

    this.listen('BottomTabSelected', 'tabSelect');
    this.listen('BottomTabPressed', 'tabPress');
    this.listen('BottomTabLongPressed', 'tabLongPress');
  }

  handleTabSelect = ({ selectedTabIndex: index }) => {
    if (this.tabIndex !== index) {
      this.tabIndex = index;
    }
  };

  getLayout(params) {
    const layout = {
      id: this.layoutId,
      children: this.order.map(id =>
        this.get(id).getInitialLayout(
          id === this.initialRouteName ? params : undefined,
        ),
      ),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  get(index) {
    if (typeof index === 'number') {
      const id = this.order[index];

      return this.routes[id];
    }

    return super.get(index);
  }

  get route() {
    const id = this.order[this.tabIndex];

    return this.get(id);
  }

  mount(params) {
    Navigation.setRoot({ root: this.getLayout(params) });
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

  getComponent() {
    if (!this.route) {
      return null;
    }

    return this.route.getComponent();
  }
}
