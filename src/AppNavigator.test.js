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

test('go', () => {
  cd.mount = jest.fn();

  app.go('cd');

  expect(cd.mount).toHaveBeenCalled();
});

test('go deep', () => {
  cd.mount = jest.fn();
  cd.push = jest.fn();

  app.go('cd/D');

  expect(cd.mount).toHaveBeenCalled();
  expect(cd.push).toHaveBeenCalledWith('D', undefined, 'Splash');
});
