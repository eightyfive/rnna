import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
// import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

import {
  createBottomTabs,
  createModal,
  createStack,
  createWidget,
} from './index.native';

function A() {}
function B() {}
function C() {}
function D() {}
function Widget() {}

test('createWidget', () => {
  const widget = createWidget('A', Widget);

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
  expect(widget.name).toBe('A');
});

// Bottom tabs
test('createBottomTabs', () => {
  const app = createBottomTabs({
    ab: { A, B },
    cd: { C, D },
  });

  expect(app).toBeInstanceOf(BottomTabsNavigator);

  expect(app.routes.has('ab')).toBe(true);
  expect(app.getRoute('ab').getRoute('A').id).toBe('ab/A');
  expect(app.getRoute('ab').getRoute('A').name).toBe('A');
  expect(app.getRoute('ab').getRoute('B').id).toBe('ab/B');
  expect(app.getRoute('ab').getRoute('B').name).toBe('B');

  expect(app.routes.has('cd')).toBe(true);
  expect(app.getRoute('cd').getRoute('C').id).toBe('cd/C');
  expect(app.getRoute('cd').getRoute('C').name).toBe('C');
  expect(app.getRoute('cd').getRoute('D').id).toBe('cd/D');
  expect(app.getRoute('cd').getRoute('D').name).toBe('D');
});

// Modal
test('createModal', () => {
  const app = createModal({ A, B });

  expect(app).toBeInstanceOf(ModalNavigator);
  expect(app.routes.has('A')).toBe(true);
  expect(app.routes.has('B')).toBe(true);
  expect(app.getRoute('A').id).toBe('A');
  expect(app.getRoute('A').name).toBe('A');
  expect(app.getRoute('B').id).toBe('B');
  expect(app.getRoute('B').name).toBe('B');
});

// Overlay
// TODO

// Stack
test('createStack', () => {
  const app = createStack({ A, B });

  expect(app).toBeInstanceOf(StackNavigator);

  expect(app.routes.has('A')).toBe(true);
  expect(app.getRoute('A').id).toBe('A');
  expect(app.getRoute('A').name).toBe('A');

  expect(app.routes.has('B')).toBe(true);
  expect(app.getRoute('B').id).toBe('B');
  expect(app.getRoute('B').name).toBe('B');
});
