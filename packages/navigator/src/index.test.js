import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import RootNavigator from './RootNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

import {
  createBottomTabs,
  createModal,
  createRoot,
  createStack,
  createWidget,
  getRouteType,
  getObjDepth,
} from './index';

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

// Root
test('createRoot', () => {
  const app = createRoot({
    abcd: { ab: { A, B }, cd: { C, D } },
    ef: { A, D },
    gh: { B, C, config: { mode: 'modal' } },
    C,
  });

  expect(app).toBeInstanceOf(RootNavigator);

  expect(app.routes.has('abcd')).toBe(true);
  expect(app.getRoute('abcd')).toBeInstanceOf(BottomTabsNavigator);

  expect(app.routes.has('ef')).toBe(true);
  expect(app.getRoute('ef')).toBeInstanceOf(StackNavigator);

  expect(app.routes.has('gh')).toBe(true);
  expect(app.getRoute('gh')).toBeInstanceOf(ModalNavigator);

  expect(app.routes.has('C')).toBe(true);
  expect(app.getRoute('C')).toBeInstanceOf(OverlayNavigator);
});

// Route types
test('Detect bottomTabs', () => {
  expect(
    getRouteType({
      ab: { A, B },
      cd: { C, D, config: { options: {} } },
    }),
  ).toBe('bottomTabs');
});

test('Detect stack', () => {
  expect(getRouteType({ A, B })).toBe('stack');
  expect(getRouteType({ A, B, config: { options: {} } })).toBe('stack');
});

test('Detect modal', () => {
  expect(getRouteType({ A, B, config: { mode: 'modal' } })).toBe('modal');
});

test('Detect overlay', () => {
  expect(getRouteType(A)).toBe('overlay');
});

test('Detect null (too deep)', () => {
  expect(
    getRouteType({
      // 1
      a: {
        // 2
        b: {
          // 3
          c: {
            // 4
            D: 'D',
          },
        },
      },
    }),
  ).toBe(null);
});

test('Obj depth', () => {
  expect(getObjDepth('A')).toBe(0);
  expect(getObjDepth({ level1: 'A' })).toBe(1);
  expect(
    getObjDepth({
      level11: { A: 'A', B: 'B' },
      level12: { C: 'C' },
    }),
  ).toBe(2);
  expect(
    getObjDepth({
      // 1
      level21: {
        // 2
        level32: {
          // 3
          C: 'C',
          D: 'D',
        },
        // 2
        level31: {
          // 3
          E: 'E',
          F: 'F',
          config: {
            // 4
            options: {
              // 5
            },
          },
        },
      },
      level22: {
        // 2
        level33: {
          // 3
          E: 'E',
          F: 'F',
        },
      },
    }),
  ).toBe(5);
});
