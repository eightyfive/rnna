import { Navigation } from 'react-native-navigation';

import { createBottomTabNavigator, createStackNavigator } from './index';

let navigator;

const A = { componentId: 'A' };
const B = { componentId: 'B' };
const C = { componentId: 'C' };

let ab;
let c;

beforeEach(() => {
  ab = createStackNavigator({ A, B });
  c = createStackNavigator({ C });

  navigator = createBottomTabNavigator({ ab, c });
  navigator.mount();
});

test('mount', () => {
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      bottomTabs: {
        id: 'ab-c',
        name: 'ab-c',
        children: [
          {
            stack: {
              children: [{ component: { id: 'A', name: 'A' } }],
            },
          },
          {
            stack: {
              children: [{ component: { id: 'C', name: 'C' } }],
            },
          },
        ],
      },
    },
  });
});

test('go', () => {
  navigator.go('c');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-c', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
