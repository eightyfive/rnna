import { Navigation } from 'react-native-navigation';

import OverlayComponent from './Layout/OverlayComponent';
import OverlayNavigator from './OverlayNavigator';

let overlay;
let navigator;

beforeEach(() => {
  overlay = new OverlayComponent('A');
  navigator = new OverlayNavigator(overlay);
});

test('mount', () => {
  navigator.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith(overlay.getLayout());
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
