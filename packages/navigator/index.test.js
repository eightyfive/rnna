import ModalNavigator from './ModalNavigator';
// import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

import { createStack, createWidget } from './index';

function Screen1() {}
Screen1.options = { topBar: { title: { text: 'Title 1' } } };

function Screen2() {}
Screen2.options = { topBar: { title: { text: 'Title 2' } } };

test('createWidget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

// Bottom tabs
// TODO

// Modal
test('createModal', () => {
  const app = createStack({ Screen1, Screen2 }, {}, { mode: 'modal' });

  expect(app).toBeInstanceOf(ModalNavigator);
});

// Overlay
// TODO

// Stack
test('createStack', () => {
  const app = createStack({ Screen1, Screen2 });

  expect(app).toBeInstanceOf(StackNavigator);
  expect(app).not.toBeInstanceOf(ModalNavigator);
});
