import { Navigation } from 'react-native-navigation';

import {
  createStacks,
  createComponentLayout,
  createStackLayout,
} from '../test-utils';
import { BottomTabsLayout } from './BottomTabsLayout';
import { StackLayout } from './StackLayout';

function makeBottomTabs(index, stacks) {
  return {
    id: `BottomTabs${index}`,
    children: stacks.map(stack => ({ stack })),
    options: { tabsAttachMode: 'onSwitchToTab' },
  };
}

let layout;

describe('BottomTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    BottomTabs.layoutIndex = 0;
    StackLayout.layoutIndex = 0;

    const stacks = createStacks();

    layout = new BottomTabs(stacks);
    layout.mount();
  });

  test('mount', () => {
    expect(layout.id).toBe('BottomTabs0');

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        bottomTabs: makeBottomTabs(0, [
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
  });
});
