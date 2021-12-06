import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';
import { makeStack } from './Stack.test';

import Component from './Component';
import Stack from './Stack';
import Modal from './Modal';

let app;

const A = new Component('A', 'A');
const B = new Component('B', 'B');

beforeEach(() => {
  app = new Modal({ A, B });
  app.mount({ foo: 'bar' });
});

test('mount', () => {
  expect(app).toBeInstanceOf(Stack);

  expect(Navigation.showModal).toHaveBeenCalledWith({
    stack: makeStack([makeComponent('A', 'A', {}, { foo: 'bar' })]),
  });
});

test('dismiss', () => {
  app.dismiss();

  expect(Navigation.dismissModal).toHaveBeenCalledWith('A');
});
