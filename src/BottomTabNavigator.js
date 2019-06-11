import Navigator from "./Navigator";

export default class BottomTabNavigator extends Navigator {
  constructor(navigation, bottomTabs, config = {}) {
    super();

    this.navigation = navigation;
    this.name = bottomTabs.id;
    this.bottomTabs = bottomTabs;
    this.order = config.order || this.bottomTabs.getOrder();
    this.initialComponentId = config.initialRouteName || this.order[0];
    this.tabIndex = 0;
  }

  mount() {
    this.navigation.setRoot({ root: this.bottomTabs.getLayout() });
  }

  navigate(path, params, fromId) {
    const [tabId, name] = this.splitPath(path);

    const layout = this.bottomTabs.getTab(tabId);

    if (!layout) {
      throw new Error(`Unknown bottomTabs tab: ${tabId} (${path})`);
    }

    const index = this.getTabIndex(tabId);

    if (this.tabIndex !== index) {
      this.tabIndex = index;

      this.navigation.mergeOptions(this.bottomTabs.id, {
        bottomTabs: { currentTabIndex: index }
      });
    }

    if (name && layout instanceof Navigator) {
      layout.navigate(name, params, fromId);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  goBack() {
    // TODO
  }

  getTabIndex(componentId) {
    const index = this.order.findIndex(id => id === componentId);

    if (index === -1) {
      throw new Error(`Unknown bottomTabs child: ${componentId}`);
    }

    return index;
  }
}
