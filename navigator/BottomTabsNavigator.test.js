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
        children: [
          {
            stack: {
              children: [{ component: { id: 'A', options: {} } }],
            },
          },
          {
            stack: {
              children: [{ component: { id: 'C', options: {} } }],
            },
          },
        ],
      },
    },
  });
});

test('navigate', () => {
  app.navigate('c');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-c', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
