import { Navigation } from 'react-native-navigation';

import { createStackNavigator, createAppNavigator } from './index';

let app;

let ab;
let cd;

const Splash = { componentId: 'Splash' };

const A = { componentId: 'A' };
const B = { componentId: 'B' };
const C = { componentId: 'C' };
const D = { componentId: 'D' };

beforeEach(() => {
  ab = createStackNavigator({ A, B });
  cd = createStackNavigator({ C, D });

  app = createAppNavigator({ Splash, ab, cd });
  app.mount();
});

test('mount', () => {
  ab.mount = jest.fn();

  expect(ab.mount).not.toHaveBeenCalled();
});

test('navigate', () => {
  cd.mount = jest.fn();

  app.navigate('cd');

  expect(cd.mount).toHaveBeenCalled();
});

test('navigate deep', () => {
  cd.mount = jest.fn();
  cd.push = jest.fn();

  app.navigate('cd/D');

  expect(cd.mount).toHaveBeenCalled();
  expect(cd.push).toHaveBeenCalledWith('D', undefined, 'Splash');
});
