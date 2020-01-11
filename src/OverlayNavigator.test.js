import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import OverlayNavigator from './OverlayNavigator';

let component;
let navigator;

beforeEach(() => {
  component = new Component('A');
  navigator = new OverlayNavigator('B', component);
});

test('mount', () => {
  navigator.mount();

  expect(Navigation.showOverlay).toHaveBeenCalledWith(component.getLayout());
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
