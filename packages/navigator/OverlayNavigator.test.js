import { Navigation } from 'react-native-navigation';

import createOverlayNavigator from './createOverlayNavigator';

let navigator;

const A = {};

beforeEach(() => {
  navigator = createOverlayNavigator({ A });
});

test('mount', () => {
  navigator.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith({
    component: { id: 'A', name: 'A', options: {} },
  });
});

test('unmount', () => {
  navigator.unmount();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
});

test('goBack', () => {
  navigator.goBack();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
});

test('dismiss', () => {
  navigator.dismiss();

  expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
});