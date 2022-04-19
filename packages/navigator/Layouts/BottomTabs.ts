import { Layout, LayoutType, Props } from './Layout';
import { Stack } from './Stack';

type BottomTabsLayout = LayoutType;

type BottomTabsRoot = { bottomTabs: BottomTabsLayout };

export class BottomTabs extends Layout<BottomTabsRoot> {
  static layoutIndex = 0;

  id: string;
  stacks: Map<string, Stack>;

  constructor(stacks: Record<string, Stack>, config = {}) {
    super(config);

    this.stacks = new Map(Object.entries(stacks));

    // Tab loading
    // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
    this.options.tabsAttachMode =
      this.options.tabsAttachMode || 'onSwitchToTab';
    this.id = `BottomTabs${BottomTabs.layoutIndex++}`;
  }

  getRoot(props: Props) {
    const children = [];

    let loop = 0;

    for (const stack of this.stacks.values()) {
      children.push(stack.getRoot(loop === 0 ? props : {}));

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
