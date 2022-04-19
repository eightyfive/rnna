import { Options, OptionsBottomTabs } from 'react-native-navigation';
import { Layout, Props } from './Layout';
import { StackLayout, StackLayoutType } from './StackLayout';

type BottomTabsChildLayoutType = {
  stack: StackLayoutType;
};

type BottomTabsLayoutType = {
  id: string;
  children: BottomTabsChildLayoutType[];
  options?: Options;
};

export class BottomTabsLayout extends Layout<
  BottomTabsLayoutType,
  'bottomTabs'
> {
  static layoutIndex = 0;

  id: string;
  stacks: Map<string, StackLayout>;

  constructor(stacks: Record<string, StackLayout>, options = {}) {
    super(options);

    this.stacks = new Map(Object.entries(stacks));

    // Tab loading
    // // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    // this.options.bottomTabs?.tabsAttachMode =
    //   this.options.bottomTabs?.tabsAttachMode || 'onSwitchToTab';
    this.id = `BottomTabs${BottomTabsLayout.layoutIndex++}`;
  }

  getLayout(props: Props) {
    const children = [];

    let loop = 0;

    for (const stack of this.stacks.values()) {
      children.push(stack.getRoot(loop === 0 ? props : {}));

      loop++;
    }

    const layout: BottomTabsLayoutType = {
      id: this.id,
      children,
    };

    if (this.hasOptions()) {
      layout.options = { ...this.options };
    }

    return layout;
  }

  getRoot(props: Props) {
    return {
      bottomTabs: this.getLayout(props),
    };
  }
}
