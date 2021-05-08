import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';

import Overlay from './Overlay';

let app;

beforeEach(() => {
  app = new Overlay('A', 'A');
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
