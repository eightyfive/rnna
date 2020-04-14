import createOverlayNavigator from './createOverlayNavigator';
import OverlayNavigator from './OverlayNavigator';

const A = {};

test('create Overlay Navigator', () => {
  const navigator = createOverlayNavigator({ A });

  expect(navigator).toBeInstanceOf(OverlayNavigator);
});
