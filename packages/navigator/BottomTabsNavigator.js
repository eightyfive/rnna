import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class BottomTabsNavigator extends Navigator {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    this.layoutId = config.layoutId || this.order.join('-');
    this.tabIndex = 0;

    this.addListener('BottomTabSelected', this.handleTabSelect);
  }

  handleTabSelect = ({ selectedTabIndex: index }) => {
    if (this.tabIndex !== index) {
      this.tabIndex = index;
    }
  };

  getLayout(props) {
    const layout = {
      id: this.layoutId,
      children: this.order.map(id =>
        this.getTab(id).getInitialLayout(
          id === this.initialRouteName ? props : undefined,
        ),
      ),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  getTab(id) {
    return this.getRoute(id, 'Tab');
  }

  get route() {
    const id = this.order[this.tabIndex];

    return this.routes.get(id);
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getLayout(initialProps) });
  }

  render(path, props) {
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
      this.route.render(rest, props);
    }
  }

  goBack() {
    try {
      this.route.goBack();
    } catch (err) {
      // TODO
    }
  }
}
