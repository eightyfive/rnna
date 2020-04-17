import { Navigation } from 'react-native-navigation';

import Component from './Component';
import BottomTabsNavigator from './BottomTabsNavigator';
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

  app = new BottomTabsNavigator({
    ab,
    cd,
  });

  app.mount();
});

test('mount', () => {
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      bottomTabs: {
        id: 'ab-cd',
        children: [
          {
            stack: {
              children: [
                {
                  component: { id: 'A', name: 'A', options: {}, passProps: {} },
                },
              ],
              options: { bottomTab: { icon: 'icon-1', text: 'Tab 1' } },
            },
          },
          {
            stack: {
              children: [
                {
                  component: { id: 'C', name: 'C', options: {}, passProps: {} },
                },
              ],
              options: { bottomTab: { icon: 'icon-2', text: 'Tab 2' } },
            },
          },
        ],
        options: {},
      },
    },
  });
});
