import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import ComponentNavigator from './ComponentNavigator';
import Stack from './Layout/Stack';
import StackNavigator from './StackNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import BottomTabs from './Layout/BottomTabs';

let navigator;

// Component A
const componentA = new Component('a');
const componentANavigator = new ComponentNavigator('A', componentA);

// Stack
const componentB = new Component('B');
const componentC = new Component('C');

const stack = new Stack('stack', [componentB, componentC]);
const stackNavigator = new StackNavigator('STACK', stack);

const tabs = new BottomTabs('tabs', [componentA, stack]);

const params = { foo: 'bar' };

beforeEach(() => {
  navigator = new BottomTabNavigator(
    'TABS',
    [componentANavigator, stackNavigator],
    tabs,
  );
  navigator.mount();
});

test('mount', () => {
  expect(Navigation.setRoot).toHaveBeenCalledWith({ root: tabs.getLayout() });
});

test('change tab', () => {
  navigator.navigate('STACK', params, 'A');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith(tabs.id, {
    bottomTabs: { currentTabIndex: 1 },
  });
});
