import BottomTabsNavigator from '@rnna/navigator/BottomTabsNavigator';
import Component from '@rnna/navigator/Component';
import StackNavigator from '@rnna/navigator/StackNavigator';

import RootNavigator from './RootNavigator';

let app;

const A = new Component('A', 'A');
const B = new Component('B', 'B');
const C = new Component('C', 'C');
const D = new Component('D', 'D');
const E = new Component('E', 'E');
const F = new Component('F', 'F');

let ab;
let cd;
let ef;

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

test('render', () => {
  app.render('ef');

  expect(app.get('ef').mount).toHaveBeenCalled();
});

test('render deep', () => {
  app.render('ef/F');

  expect(app.get('ef').mount).toHaveBeenCalled();
  expect(app.get('ef').push).toHaveBeenCalledWith('F', undefined);
});
