import Navigator from './Navigator';

export default class BottomTabsNavigator extends Navigator {
  constructor(bottomTabs) {
    super({}, {});

    this.bottomTabs = bottomTabs;
  }

  render(path, props) {
    this.renderBottomTabs(this.bottomTabs, path, props);
  }

  goBack() {
    this.goBackBottomTabs(this.bottomTabs);
  }
}
