import {
  createDrawerNavigator,
  createModalNavigator,
  createOverlayNavigator,
  createStackNavigator,
  createWidget,
} from './index';

import Component from './Component';
import DrawerNavigator from './DrawerNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

const A = { componentId: 'A' };
const B = { componentId: 'B' };
const Drawer = { componentId: 'Drawer' };

test('create Stack Navigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Modal Navigator', () => {
  const navigator = createModalNavigator({ A, B });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Overlay Navigator', () => {
  const navigator = createOverlayNavigator({ A });

  expect(navigator instanceof OverlayNavigator).toBe(true);
});

// test('create Drawer Navigator', () => {
//   const navigator = createDrawerNavigator(
//     { A, B },
//     { contentComponent: Drawer },
//   );

//   expect(navigator instanceof DrawerNavigator).toBe(true);
//   expect(navigator.drawer instanceof Component).toBe(true);
// });

test('create Widget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});
