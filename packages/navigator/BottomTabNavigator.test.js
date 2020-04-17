import { Navigation } from 'react-native-navigation';

import { Component } from './wix';
import BottomTabNavigator from './BottomTabNavigator';
import StackNavigator from './StackNavigator';

let app;

const A = new Component('A');
const B = new Component('B');
const C = new Component('C');
const D = new Component('D');

let ab;
let cd;

beforeEach(() => {
  ab = new StackNavigator(
    { A, B },
    { bottomTab: { icon: 'icon-1', text: 'Tab 1' } },
  );

  cd = new StackNavigator(
    { C, D },
    { bottomTab: { icon: 'icon-2', text: 'Tab 2' } },
  );

  app = new BottomTabNavigator({
    ab,
    cd,
  });

  app.mount();
});

test('navigate', () => {
  app.navigate('cd');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-cd', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
