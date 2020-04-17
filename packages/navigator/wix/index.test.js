import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';

import {
  createModalNavigator,
  createOverlayNavigator,
  createStackNavigator,
} from './index';

const A = {};
const B = {};

// Bottom tabs
// TODO

// Modal
test('createModalNavigator', () => {
  const navigator = createModalNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).toBeInstanceOf(ModalNavigator);
});

// Overlay
test('createOverlayNavigator', () => {
  const navigator = createOverlayNavigator({ A });

  expect(navigator).toBeInstanceOf(OverlayNavigator);
});

// Stack
test('createStackNavigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).not.toBeInstanceOf(ModalNavigator);
});
