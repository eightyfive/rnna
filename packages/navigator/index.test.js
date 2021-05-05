import ModalNavigator from './ModalNavigator';
// import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

import { createModal, createStack, createWidget } from './index.native';

function Screen1() {}
Screen1.options = { topBar: { title: { text: 'Title 1' } } };

function Screen2() {}
Screen2.options = { topBar: { title: { text: 'Title 2' } } };

function Widget() {}

test('createWidget', () => {
  const widget = createWidget('A', Widget);

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
  expect(widget.name).toBe('A');
});

// Bottom tabs
// TODO

// Modal
test('createModal', () => {
  const app = createModal({ Screen1, Screen2 });

  expect(app).toBeInstanceOf(ModalNavigator);
  expect(app.routes.has('Screen1')).toBe(true);
  expect(app.routes.has('Screen2')).toBe(true);
  expect(app.routes.get('Screen1').id).toBe('Screen1');
  expect(app.routes.get('Screen1').name).toBe('Screen1');
  expect(app.routes.get('Screen2').id).toBe('Screen2');
  expect(app.routes.get('Screen2').name).toBe('Screen2');
});

// Overlay
// TODO

// Stack
test('createStack', () => {
  const app = createStack({ Screen1, Screen2 }, { parentId: 'someTabName' });

  expect(app).toBeInstanceOf(StackNavigator);
  expect(app.routes.has('Screen1')).toBe(true);
  expect(app.routes.has('Screen2')).toBe(true);
  expect(app.routes.get('Screen1').id).toBe('someTabName/Screen1');
  expect(app.routes.get('Screen1').name).toBe('Screen1');
  expect(app.routes.get('Screen2').id).toBe('someTabName/Screen2');
  expect(app.routes.get('Screen2').name).toBe('Screen2');
});
