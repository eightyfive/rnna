import { Navigation } from 'react-native-navigation';

import {
  createComponentLayout,
  createStacks,
  createBottomTabsLayout,
  createStackLayout,
} from './test-utils';
import { BottomTabs } from './BottomTabs';
import { Layout } from './Layout';

let app: BottomTabs;

describe('BottomTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Layout.layoutIndex = 0;

    const stacks = createStacks();

    app = new BottomTabs(stacks);
    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('BottomTabs7');

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        bottomTabs: createBottomTabsLayout('BottomTabs7', [
          createStackLayout('Stack5', [
            createComponentLayout('Component1', 'A', {
              topBar: { title: { text: 'Title A' } },
            }),
          ]),
          createStackLayout('Stack6', [
            createComponentLayout('Component3', 'C', {
              topBar: { title: { text: 'Title C' } },
            }),
          ]),
        ]),
      },
    });
  });

  test('select tab', () => {
    app.selectTab(1);

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs7', {
      bottomTabs: { currentTabIndex: 1 },
    });
  });
});
