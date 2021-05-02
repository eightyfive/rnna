import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';
import { makeStack } from './StackNavigator.test';

import Component from './Component.native';
import StackNavigator from './StackNavigator';
import ModalNavigator from './ModalNavigator';

let app;

const A = new Component('A');
const B = new Component('B');

beforeEach(() => {
  app = new ModalNavigator({ A, B });
  app.mount({ foo: 'bar' });
});

test('mount', () => {
  expect(app instanceof StackNavigator).toBe(true);

  expect(Navigation.showModal).toHaveBeenCalledWith({
    stack: makeStack([makeComponent('A', {}, { foo: 'bar' })]),
  });
});

test('unmount', () => {
  app.unmount('A');

  expect(Navigation.dismissModal).toHaveBeenCalledWith('A');
});
