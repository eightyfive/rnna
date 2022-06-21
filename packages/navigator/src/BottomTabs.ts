import {
  Navigation,
  Options,
  OptionsBottomTabs,
} from 'react-native-navigation';

import { Layout } from './Layout';
import { Stack, StackLayout } from './Stack';
import { Props } from './types';

// Layout
type BottomTabsChildLayout = {
  stack: StackLayout;
};

export type BottomTabsLayout = {
  id: string;
  children: BottomTabsChildLayout[];
  options?: Options;
};

// Options
export type BottomTabsOptions = OptionsBottomTabs;

export class BottomTabs extends Layout<BottomTabsLayout, BottomTabsOptions> {
  stacks: Stack[];
  order: string[];

  constructor(stacks: Record<string, Stack>, options?: BottomTabsOptions) {
    const order = Object.keys(stacks);

    super(order.join('-'), options);

    this.stacks = Object.values(stacks);
    this.order = order;

    // Tab loading
    // // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    // this.options.bottomTabs?.tabsAttachMode =
    //   this.options.bottomTabs?.tabsAttachMode || 'onSwitchToTab';
  }

  get(name: string) {
    const index = this.order.indexOf(name);

    if (this.stacks[index]) {
      return this.stacks[index];
    }

    throw new Error(`Tab not found: ${name}`);
  }

  getLayout(props?: Props) {
    const children = this.stacks.map((stack, index) =>
      stack.getRoot(index === 0 ? props : undefined),
    );

    const layout: BottomTabsLayout = {
      id: this.id,
      children,
    };

    if (this.options) {
      layout.options = this.getOptions(this.options);
    }

    return layout;
  }

  getOptions(options: BottomTabsOptions): Options {
    return {
      bottomTabs: options,
    };
  }

  getRoot(props?: Props) {
    return {
      bottomTabs: this.getLayout(props),
    };
  }

  mount(props?: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });
  }

  selectTab(indexOrName: string | number) {
    let index;

    if (typeof indexOrName === 'string') {
      index = this.order.indexOf(indexOrName);

      if (index === -1) {
        throw new Error(`Tab not found: ${indexOrName}`);
      }
    } else {
      index = indexOrName;
    }

    this.setOptions({ currentTabIndex: index });
  }
}
