import { Navigation } from 'react-native-navigation';

import Component from './Component';
import OverlayNavigator from './OverlayNavigator';

let navigator;

const A = new Component('A');

beforeEach(() => {
  navigator = new OverlayNavigator({ A });
});

test('mount', () => {
  navigator.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith({
    component: { id: 'A', name: 'A', options: {}, passProps: {} },
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
