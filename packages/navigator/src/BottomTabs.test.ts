import { Navigation } from 'react-native-navigation';

import {
  createComponentLayout,
  createStacks,
  createBottomTabsLayout,
  createStackLayout,
} from './test-utils';
import { BottomTabs } from './BottomTabs';
import { Stack } from './Stack';

let app: BottomTabs;

describe('BottomTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    BottomTabs.layoutIndex = 0;
    Stack.layoutIndex = 0;

    const stacks = createStacks();

    app = new BottomTabs(stacks);
    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('BottomTabs0');

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        bottomTabs: createBottomTabsLayout(0, [
          createStackLayout(0, [
            createComponentLayout('a', 'A', {
              topBar: { title: { text: 'Title A' } },
            }),
          ]),
          createStackLayout(1, [
            createComponentLayout('c', 'C', {
              topBar: { title: { text: 'Title C' } },
            }),
          ]),
        ]),
      },
    });

    expect(app.tabIndex).toBe(0);
  });

  test('select tab', () => {
    app.selectTab(1);

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs0', {
      bottomTabs: { currentTabIndex: 1 },
    });
  });
});
