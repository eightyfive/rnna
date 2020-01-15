import { Navigation } from 'react-native-navigation';

import { createOverlayNavigator } from './index';

let navigator;

function A() {}

beforeEach(() => {
  navigator = createOverlayNavigator(A);
});

test('mount', () => {
  navigator.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith({
    component: {
      id: 'overlay-A',
      name: 'overlay-A',
    },
  });
});

test('unmount', () => {
  navigator.unmount();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('overlay-A');
});

test('goBack', () => {
  navigator.goBack();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('overlay-A');
});

test('dismiss', () => {
  navigator.dismiss();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('overlay-A');
});
