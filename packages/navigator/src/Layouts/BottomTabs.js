import { Navigation } from 'react-native-navigation';

import Layout from './Layout';
import Stack from './Stack';

export default class BottomTabs extends Layout {
  static layoutIndex = 0;

  constructor(stacks, config = {}) {
    super(config);

    this.stacks = new Map(Object.entries(stacks));

    const notStack = Array.from(this.stacks.values()).some(
      stack => !(stack instanceof Stack),
    );

    if (notStack.length) {
      throw new TypeError('Invalid argument');
    }

    this.order = Array.from(this.stacks.keys());
    this.tabIndex = 0;
    this.stackName = this.order[0];

    // Tab loading
    // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    this.options.tabsAttachMode =
      this.options.tabsAttachMode || 'onSwitchToTab';
    this.layoutId = `BottomTabs${this.constructor.layoutIndex++}`;

    this.stacks.forEach((stack, name) => {
      this.defineProperty(name, stack);
    });
  }

  mount(initialProps) {
    Navigation.setRoot({ root: this.getLayout(initialProps) });
  }

  getLayout(props) {
    const layout = {
      id: this.layoutId,
      children: this.order.map((name, index) =>
        this.stacks
          .get(name)
          .getInitialLayout(index === this.tabIndex ? props : undefined),
      ),
      options: { ...this.options },
    };

    return { bottomTabs: layout };
  }

  findIndex(indexOrName) {
    let index;

    if (typeof indexOrName === 'string') {
      index = this.order.findIndex(name => name === indexOrName);

      if (index === -1) {
        throw new Error(`Tab name not found: ${indexOrName}`);
      }
    } else {
      index = indexOrName;

      if (indexOrName > this.order.length - 1) {
        throw new Error(
          `Tab index out of range: ${indexOrName} (${this.order.length})`,
        );
      }
    }

    return index;
  }

  getTab() {
    return this.findTab(this.tabIndex);
  }

  findTab(indexOrName) {
    const index = this.findIndex(indexOrName);

    const name = this.order[index];

    return this.stacks.get(name);
  }

  selectTab(indexOrName) {
    const index = this.findIndex(indexOrName);

    if (this.tabIndex !== index) {
      this.tabIndex = index;
      this.stackName = this.order[index];

      Navigation.mergeOptions(this.layoutId, {
        bottomTabs: { currentTabIndex: index },
      });
    }
  }
}
