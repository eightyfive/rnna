import { Navigation } from 'react-native-navigation';

import createBottomTabsNavigator from './createBottomTabsNavigator';
import createStackNavigator from './createStackNavigator';

let app;

const A = {};
const B = {};
const C = {};

beforeEach(() => {
  app = createBottomTabsNavigator({
    ab: createStackNavigator({ A, B }),
    c: createStackNavigator({ C }),
  });

  app.mount();
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
  app.go('c');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-c', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
