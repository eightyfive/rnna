import { Navigation } from 'react-native-navigation';

import { BottomTabs } from './Layouts';

export default class BottomTabsNavigator extends BottomTabs {
  constructor(stacks, config = {}) {
    super(stacks, config);

    this.tabIndex = 0;
  }

  mount(props) {
    super.mount(props);

    for (const stack of this.stacks.values()) {
      stack.init();
    }
  }

  selectTab(index) {
    this.tabIndex = index;

    Navigation.mergeOptions(this.id, {
      bottomTabs: { currentTabIndex: index },
    });
  }

  getStackAt(index) {
    let loop = 0;

    for (const stack of this.stacks.values()) {
      if (loop === index) {
        return stack;
      }

      loop++;
    }

    throw new Error(`Tab index not found: ${index}`);
  }
}
