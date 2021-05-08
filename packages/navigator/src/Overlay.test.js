import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';

import Component from './Component';
import Overlay from './Overlay';

let app;

const A = new Component('A', 'A');

beforeEach(() => {
  app = new Overlay(A);
  app.mount();
});

test('mount', () => {
  expect(Navigation.showOverlay).toHaveBeenCalledWith({
    component: makeComponent('A', 'A'),
  });
});

test('unmount (dismiss)', () => {
  app.unmount();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
});
