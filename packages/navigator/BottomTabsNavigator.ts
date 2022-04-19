import { Navigation, Options } from 'react-native-navigation';

import { Layout, Props } from './Layout';
import { StackLayout, StackNavigator } from './StackNavigator';

type BottomTabsChildLayout = {
  stack: StackLayout;
};

export type BottomTabsLayout = {
  id: string;
  children: BottomTabsChildLayout[];
  options?: Options;
};

export class BottomTabsNavigator extends Layout<BottomTabsLayout> {
  static layoutIndex = 0;

  stacks: Map<string, StackNavigator>;
  tabIndex: number;
  order: string[];

  constructor(stacks: Record<string, StackNavigator>, options = {}) {
    super(`BottomTabs${BottomTabsNavigator.layoutIndex++}`, options);

    this.stacks = new Map(Object.entries(stacks));

    // Tab loading
    // // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    // this.options.bottomTabs?.tabsAttachMode =
    //   this.options.bottomTabs?.tabsAttachMode || 'onSwitchToTab';

    this.order = Object.keys(stacks);
    this.tabIndex = 0;
  }

  getLayout(props?: Props) {
    const children = this.order.map((name, index) => {
      const stack = this.stacks.get(name);

      if (index === 0) {
        return stack!.getRoot(props);
      }

      return stack!.getRoot();
    });

    const layout: BottomTabsLayout = {
      id: this.id,
      children,
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return layout;
  }

  getRoot(props?: Props) {
    return {
      bottomTabs: this.getLayout(props),
    };
  }

  mount(props: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });

    for (const stack of this.stacks.values()) {
      stack.init();
    }
  }

  selectTab(index: number) {
    this.tabIndex = index;

    Navigation.mergeOptions(this.id, {
      bottomTabs: { currentTabIndex: index },
    });
  }

  getStackAt(index: number) {
    const name = this.order[index];
    const stack = this.stacks.get(name);

    if (!stack) {
      throw new Error(`Stack not found at index: ${index}`);
    }

    return stack;
  }
}
