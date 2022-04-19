import { Navigation } from 'react-native-navigation';

import { createStacks } from './test-utils.js';
import { BottomTabs } from './Layouts/BottomTabs';
import BottomTabsNavigator from './BottomTabsNavigator';

let app;

describe('BottomTabsNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    BottomTabs.layoutIndex = 0;

    const stacks = createStacks();

    app = new BottomTabsNavigator(stacks);
    app.mount();
  });

  test('mount', () => {
    expect(app.tabIndex).toBe(0);
  });

  test('select tab', () => {
    app.selectTab(1);

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs0', {
      bottomTabs: { currentTabIndex: 1 },
    });
  });
});
