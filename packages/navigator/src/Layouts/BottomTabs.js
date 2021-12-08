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

    // Tab loading
    // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    this.options.tabsAttachMode =
      this.options.tabsAttachMode || 'onSwitchToTab';
    this.id = `BottomTabs${BottomTabs.layoutIndex++}`;
  }

  getRoot(props) {
    const children = [];

    let loop = 0;

    for (const stack of this.stacks.values()) {
      children.push(stack.getRoot(loop === 0 ? props : undefined));

      loop++;
    }

    const layout = {
      id: this.id,
      children,
      options: { ...this.options },
    };

    return { bottomTabs: layout };
  }
}
