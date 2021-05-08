import RootNavigator from './RootNavigator';
import { BottomTabs, Modal, Overlay, Stack, Widget } from './Layouts';

import {
  createBottomTabs,
  createModal,
  createRootNavigator,
  createStack,
  createWidget,
} from './index';

function A() {}
function B() {}
function C() {}
function D() {}
function E() {}

test('createWidget', () => {
  const widget = createWidget('E', E);

  expect(widget instanceof Widget).toBe(true);
  expect(widget.id).toBe('widget-E');
  expect(widget.name).toBe('E');
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
