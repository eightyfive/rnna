import { Navigation, Options } from 'react-native-navigation';

import { Layout } from './Layout';
import { Stack } from './Stack';
import { BottomTabsLayout, Props, ReactComponent } from './types';

export class BottomTabs extends Layout<BottomTabsLayout> {
  static layoutIndex = 0;

  stacks: Stack[];
  order: string[];

  constructor(stacks: Record<string, Stack>, options?: Options) {
    super(`BottomTabs${BottomTabs.layoutIndex++}`, options);

    this.stacks = Object.values(stacks);
    this.order = Object.keys(stacks);

    // Tab loading
    // // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    // this.options.bottomTabs?.tabsAttachMode =
    //   this.options.bottomTabs?.tabsAttachMode || 'onSwitchToTab';
  }

  getLayout(props?: Props) {
    const children = this.stacks.map((stack, index) => {
      if (index === 0) {
        return stack.getRoot(props);
      }

      return stack.getRoot();
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

    Navigation.mergeOptions(this.id, {
      bottomTabs: { currentTabIndex: index },
    });
  }

  register(Provider?: ReactComponent) {
    this.stacks.forEach(stack => {
      stack.register(Provider);
    });
  }
}
