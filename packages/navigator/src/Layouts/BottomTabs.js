import { Navigation } from 'react-native-navigation';

import Layout from './Layout';
import Stack from './Stack';

export default class BottomTabs extends Layout {
  static layoutIndex = 0;

  constructor(stacks, config = {}) {
    super(config);

    this.stacks = new Map(Object.entries(stacks));

    // Validation
    for (const stack of this.stacks.values()) {
      if (!(stack instanceof Stack)) {
        throw new TypeError('Invalid argument: Only stacks allowed');
      }
    }

    this.tabIndex = 0;

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
    const children = [];

    for (const stack of this.stacks.values()) {
      children.push(
        stack.getInitialLayout(index === this.tabIndex ? props : undefined),
      );
    }

    const layout = {
      id: this.layoutId,
      children,
      options: { ...this.options },
    };

    return { bottomTabs: layout };
  }

  getTab() {
    return this.findTab(this.tabIndex);
  }

  findTab(index) {
    let loop = 0;

    for (const stack of this.stacks.values()) {
      if (loop === index) {
        return stack;
      }

      loop++;
    }

    throw new Error(`Tab index not found: ${index}`);
  }

  selectTab(index) {
    this.tabIndex = index;

    Navigation.mergeOptions(this.layoutId, {
      bottomTabs: { currentTabIndex: index },
    });
  }
}
