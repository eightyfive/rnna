import { Navigation } from 'react-native-navigation';

import {
  createDrawerNavigator,
  createModalNavigator,
  createOverlayNavigator,
  createStackNavigator,
  createWidget,
} from './index';

import {
  Component,
  DrawerNavigator,
  OverlayNavigator,
  StackNavigator,
  WidgetComponent,
} from './navigators';

function A() {}
function B() {}
function Drawer() {}

test('create Stack Navigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(Navigation.registerComponent).toHaveBeenNthCalledWith(
    1,
    'A',
    expect.anything(),
  );
  expect(Navigation.registerComponent).toHaveBeenNthCalledWith(
    2,
    'B',
    expect.anything(),
  );

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Modal Navigator', () => {
  const navigator = createModalNavigator({ A, B });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Overlay Navigator', () => {
  const navigator = createOverlayNavigator(A);

  expect(navigator instanceof OverlayNavigator).toBe(true);
  expect(navigator.id).toBe('overlay-A');
});

test('create Drawer Navigator', () => {
  const navigator = createDrawerNavigator(
    Drawer,
    { A, B },
    // { drawerId: 'customDrawerId' },
  );

  // expect(Navigation.registerComponent).toHaveBeenCalledWith(
  //   'customDrawerId',
  //   expect.anything(),
  // );

  expect(navigator instanceof DrawerNavigator).toBe(true);
  expect(navigator.drawer instanceof Component).toBe(true);
});

test('create Widget', () => {
  const widget = createWidget(A);

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});
