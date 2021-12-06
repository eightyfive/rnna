import Navigator from './Navigator';

export default class BottomTabsNavigator extends Navigator {
  constructor(bottomTabs, config = {}) {
    super(config);

    this.bottomTabs = bottomTabs;
  }

  getLayout() {
    return this.bottomTabs;
  }

  getStack() {
    return this.bottomTabs.getTab();
  }
}
