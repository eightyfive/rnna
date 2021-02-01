import { Navigation } from 'react-native-navigation';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';
import { makeComponent } from './Component.test';
import { makeStack } from './StackNavigator.test';

import { createStackNavigator, createWidget } from './index';

function Screen1() {}
Screen1.options = { topBar: { title: { text: 'Title 1' } } };

function Screen2() {}
Screen2.options = { topBar: { title: { text: 'Title 2' } } };

function Screen3() {}

function Screen4() {}

function Screen5() {}
Screen5.options = { layout: { componentBackgroundColor: 'dummy' } };

test('createWidget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

// Bottom tabs
// TODO

// Modal
test('createModalNavigator', () => {
  const app = createStackNavigator({ Screen1, Screen2 }, {}, { mode: 'modal' });

  expect(app).toBeInstanceOf(ModalNavigator);
});

// // Overlay
// test('createOverlayNavigator', () => {
//   const app = createStackNavigator({ Screen1 }, {}, { mode: 'overlay' });

//   expect(app).toBeInstanceOf(OverlayNavigator);
// });

// Stack
test('createStackNavigator', () => {
  const app = createStackNavigator({ Screen1, Screen2 });

  expect(app).toBeInstanceOf(StackNavigator);
  expect(app).not.toBeInstanceOf(ModalNavigator);
});
