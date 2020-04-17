import { Navigation } from 'react-native-navigation';

import createBottomTabsNavigator from './createBottomTabsNavigator';
import createStackNavigator from './createStackNavigator';

let app;

const A = {};
const B = {};
const C = {};

beforeEach(() => {
  app = createBottomTabsNavigator({
    ab: createStackNavigator(
      { A, B },
      { bottomTab: { icon: 'icon-1', text: 'Tab 1' } },
    ),
    c: createStackNavigator(
      { C },
      { bottomTab: { icon: 'icon-2', text: 'Tab 2' } },
    ),
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
              children: [{ component: { id: 'A', name: 'A', options: {} } }],
              options: { bottomTab: { icon: 'icon-1', text: 'Tab 1' } },
            },
          },
          {
            stack: {
              children: [{ component: { id: 'C', name: 'C', options: {} } }],
              options: { bottomTab: { icon: 'icon-2', text: 'Tab 2' } },
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
