import { Navigation } from 'react-native-navigation';

import { createStackNavigator, createRootNavigator } from './index';

let root;

let stack1;
let stack2;

function ComponentA() {}
function ComponentB() {}
function ComponentC() {}
function ComponentD() {}

beforeEach(() => {
  stack1 = createStackNavigator({ ComponentA, ComponentB });
  stack2 = createStackNavigator({ ComponentC, ComponentD });

  stack1.mount = jest.fn();

  root = createRootNavigator({ stack1, stack2 });
  root.mount();
});

test('mount', () => {
  expect(stack1.mount).toHaveBeenCalled();
});

test('navigate', () => {
  stack2.mount = jest.fn();

  root.navigate('stack2');

  expect(stack2.mount).toHaveBeenCalled();
});

test('navigate deep', () => {
  stack2.mount = jest.fn();
  stack2.push = jest.fn();

  root.navigate('stack2/D');

  expect(stack2.mount).toHaveBeenCalled();
  expect(stack2.push).toHaveBeenCalledWith('D', undefined, 'Splash');
});
