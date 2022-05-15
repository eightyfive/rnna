import { Navigation } from 'react-native-navigation';

import {
  createComponentLayout,
  createStacks,
  createBottomTabsLayout,
  createStackLayout,
} from './test-utils';
import { BottomTabs } from './BottomTabs';

let app: BottomTabs;

const options = {
  animate: true,
  backgroundColor: 'red',
};

describe('BottomTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const stacks = createStacks();

    app = new BottomTabs(stacks, options);

    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('ab-cd');

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        bottomTabs: createBottomTabsLayout(
          'ab-cd',
          [
            createStackLayout('A-B', [createComponentLayout('A')]),
            createStackLayout('C-D', [createComponentLayout('C')]),
          ],
          {
            bottomTabs: options,
          },
        ),
      },
    });
  });

  test('select tab', () => {
    app.selectTab(1);

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-cd', {
      bottomTabs: { currentTabIndex: 1 },
    });
  });
});
