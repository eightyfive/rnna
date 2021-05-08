import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';

import Component from './Component';
import OverlayNavigator from './OverlayNavigator';

let app;

const A = new Component('A', 'A');

beforeEach(() => {
  app = new OverlayNavigator();

  app.addRoute('A', A);
});

test('mount', () => {
  app.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith({
    component: makeComponent('A', 'A'),
  });
});

test('unmount', () => {
  app.mount();
  app.unmount();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
});
