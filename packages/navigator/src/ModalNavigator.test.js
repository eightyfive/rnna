import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';
import { makeStack } from './StackNavigator.test';

import Component from './Component.native';
import StackNavigator from './StackNavigator';
import ModalNavigator from './ModalNavigator';

let app;

const A = new Component('A', 'A');
const B = new Component('B', 'B');

beforeEach(() => {
  app = new ModalNavigator();

  app.addRoute('A', A);
  app.addRoute('B', B);

  app.mount({ foo: 'bar' });
});

test('mount', () => {
  expect(app instanceof StackNavigator).toBe(true);

  expect(Navigation.showModal).toHaveBeenCalledWith({
    stack: makeStack([makeComponent('A', 'A', {}, { foo: 'bar' })]),
  });
});

test('unmount', () => {
  app.unmount('A');

  expect(Navigation.dismissModal).toHaveBeenCalledWith('A');
});
