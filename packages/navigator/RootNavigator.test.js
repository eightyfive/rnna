import { Component } from './wix';

import BottomTabsNavigator from './BottomTasbNavigator';
import RootNavigator from './RootNavigator';
import StackNavigator from './StackNavigator';

let app;

const A = new Component('A');
const B = new Component('B');
const C = new Component('C');
const D = new Component('D');
const E = new Component('E');
const F = new Component('F');

let ab;
let cd;
let ef;

let tabs;

beforeEach(() => {
  jest.clearAllMocks();

  ab = new StackNavigator({ A, B });
  cd = new StackNavigator({ C, D });
  ef = new StackNavigator({ E, F });

  abcd = new BottomTabsNavigator({ ab, cd });

  app = new RootNavigator({
    abcd,
    ef,
  });

  app.get('abcd').mount = jest.fn();
  app.get('ef').mount = jest.fn();
  app.get('ef').push = jest.fn();

  app.mount();
});

test('mount', () => {
  expect(app.get('ef').mount).not.toHaveBeenCalled();
});

test('navigate', () => {
  app.navigate('ef');

  expect(app.get('ef').mount).toHaveBeenCalled();
});

test('navigate deep', () => {
  app.navigate('ef/F');

  expect(app.get('ef').mount).toHaveBeenCalled();
  expect(app.get('ef').push).toHaveBeenCalledWith('F', undefined, 'abcd');
});
