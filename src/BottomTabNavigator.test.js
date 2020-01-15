import { Navigation } from 'react-native-navigation';

import { createBottomTabNavigator } from './index';

let navigator;

function A() {}
function B() {}

function Drawer() {}

beforeEach(() => {
  navigator = createBottomTabNavigator({ A, B });
  navigator.mount();
});

test('mount', () => {
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      bottomTabs: {
        id: 'A-B',
        name: 'A-B',
        children: [
          { component: { id: 'A', name: 'A' } },
          { component: { id: 'B', name: 'B' } },
        ],
      },
    },
  });
});

test('navigate', () => {
  navigator.navigate('B');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('A-B', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
