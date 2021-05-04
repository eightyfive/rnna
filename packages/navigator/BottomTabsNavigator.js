import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';

export default class BottomTabsNavigator extends Navigator {
  static layoutIndex = 0;

  constructor(config = {}) {
    super({}, config.options || {}, config);

    this.stacks = new Map();

    this.layoutId = `BottomTabs${this.constructor.layoutIndex++}`;
    this.tabIndex = 0;

    this.addListener('BottomTabSelected', this.handleTabSelect);
  }

  handleTabSelect = ({ selectedTabIndex: index }) => {
    if (this.tabIndex !== index) {
      this.tabIndex = index;
    }
  };

  findStackIndexByName(name) {
    let index = 0;

    for (const stackName of this.stacks.keys()) {
      if (stackName === name) {
        return index;
      }

      index++;
    }

    throw new Error(`Tab not found: ${name}`);
  }

  addRoute(name, route) {
    this.addStack(name, route);
  }

  addStack(name, stack) {
    if (!this.stacks.size) {
      this.initialRouteName = name;
    }

    this.stacks.set(name, stack);
  }

  getLayout(props) {
    const order = Array.from(this.stacks.keys());

    const layout = {
      id: this.layoutId,
      children: order.map(name =>
        this.stacks
          .get(name)
          .getInitialLayout(name === this.initialRouteName ? props : undefined),
      ),
      options: { ...this.options },
    };

    return { bottomTabs: layout };
  }

  get route() {
    const id = this.order[this.tabIndex];

    return this.routes.get(id);
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getLayout(initialProps) });
  }

  render(path, props) {
    const [stackName, rest] = this.parsePath(path);
    const stack = this.stacks.get(stackName);

    if (!stack) {
      throw new Error(`Tab not found: ${stackName}`);
    }

    if (this.stackName !== stackName) {
      this.stackName = stackName;

      const stackIndex = this.findStackIndexByName(stackName);

      Navigation.mergeOptions(this.layoutId, {
        bottomTabs: { currentTabIndex: stackIndex },
      });
    }

    if (rest) {
      stack.render(rest, props);
    }
  }

  goBack() {
    try {
      const stack = this.stacks.get(stackName);

      stack.goBack();
    } catch (err) {
      // TODO
    }
  }
}
