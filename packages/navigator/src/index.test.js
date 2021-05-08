import RootNavigator from './RootNavigator';
import WidgetComponent from './WidgetComponent';
import { BottomTabs, Modal, Overlay, Stack } from './Layouts';

import {
  createBottomTabs,
  createModal,
  createRootNavigator,
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

  expect(app).toBeInstanceOf(BottomTabs);
  expect(app.ab.A.id).toBe('ab/A');
  expect(app.ab.A.name).toBe('A');
  expect(app.ab.B.id).toBe('ab/B');
  expect(app.ab.B.name).toBe('B');
  expect(app.cd.C.id).toBe('cd/C');
  expect(app.cd.C.name).toBe('C');
  expect(app.cd.D.id).toBe('cd/D');
  expect(app.cd.D.name).toBe('D');
});

// Modal
test('createModal', () => {
  const app = createModal({ A, B });

  expect(app).toBeInstanceOf(Modal);
  expect(app.A.id).toBe('A');
  expect(app.A.name).toBe('A');
  expect(app.B.id).toBe('B');
  expect(app.B.name).toBe('B');
});

// Stack
test('createStack', () => {
  const app = createStack({ A, B });

  expect(app).toBeInstanceOf(Stack);

  expect(app.A.id).toBe('A');
  expect(app.A.name).toBe('A');

  expect(app.B.id).toBe('B');
  expect(app.B.name).toBe('B');
});

// Root
test('createRootNavigator', () => {
  const app = createRootNavigator({
    abcd: { ab: { A, B }, cd: { C, D } },
    ef: { A, D },
    gh: { B, C, config: { mode: 'modal' } },
    C,
  });

  expect(app).toBeInstanceOf(RootNavigator);
  expect(app.abcd).toBeInstanceOf(BottomTabs);
  expect(app.ef).toBeInstanceOf(Stack);
  expect(app.gh).toBeInstanceOf(Modal);
  expect(app.C).toBeInstanceOf(Overlay);
});

// Layout types
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
