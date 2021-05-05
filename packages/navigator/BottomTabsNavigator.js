import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';
import StackNavigator from './StackNavigator';

export default class BottomTabsNavigator extends Navigator {
  static layoutIndex = 0;

  constructor(config = {}) {
    super(config);

    // Tab loading
    // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    const { tabsAttachMode } = this.options;

    this.options.tabsAttachMode = tabsAttachMode || 'onSwitchToTab';

    this.layoutId = `BottomTabs${this.constructor.layoutIndex++}`;
  }

  addRoute(name, stack) {
    if (!(stack instanceof StackNavigator)) {
      throw new Error('BottomTabs route must be a `StackNavigator` instance');
    }

    super.addRoute(name, stack);
  }

  getLayout(props) {
    const stackNames = Array.from(this.routes.keys());

    const layout = {
      id: this.layoutId,
      children: stackNames.map(name =>
        this.getRoute(name).getInitialLayout(
          name === this.initialRouteName ? props : undefined,
        ),
      ),
      options: { ...this.options },
    };

    return { bottomTabs: layout };
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getLayout(initialProps) });
  }

  render(path, props) {
    const [name, componentName] = this.readPath(path);
    const stack = this.getRoute(name);

    if (!this.history.isCurrent(name)) {
      this.history.reset(name);

      const index = this.findRouteIndexByName(name);

      Navigation.mergeOptions(this.layoutId, {
        bottomTabs: { currentTabIndex: index },
      });
    }

    stack.render(componentName, props);
  }

  goBack() {
    try {
      const stack = this.getCurrentRoute();

      stack.goBack();
    } catch (err) {
      // TODO
    }
  }
}
