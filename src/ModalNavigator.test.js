import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import Stack from './Layout/Stack';
import ModalNavigator from './ModalNavigator';

let stack;
let navigator;

const componentA = new Component('A');
const componentB = new Component('B');
const componentC = new Component('C');

const params = { foo: 'bar' };

beforeEach(() => {
  stack = new Stack([componentA, componentB, componentC]);
  navigator = new ModalNavigator(stack);
  navigator.mount();
});

test('mount', () => {
  expect(Navigation.showModal).toHaveBeenCalledWith(stack.getLayout('A'));
});

test('unmount', () => {
  navigator.unmount('A');

  expect(Navigation.dismissModal).toHaveBeenCalledWith('A');
});
