import { BottomTabs } from './BottomTabs';
import { Component } from './Component';
import { Modal } from './Modal';
import { Stack } from './Stack';
import { Widget } from './Widget';
import {
  createBottomTabs,
  createModal,
  createOverlay,
  createStack,
  createWidget,
} from './index';

function A() {
  return null;
}

function B() {
  return null;
}

function C() {
  return null;
}

function D() {
  return null;
}

test('createWidget', () => {
  const widget = createWidget('E');

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

  app.mount();

  expect(app).toBeInstanceOf(BottomTabs);

  const stack = app.getStackAt(0);
  expect(stack).toBeInstanceOf(Stack);

  const component = Array.from(stack.components.values())[0];

  expect(component).toBeInstanceOf(Component);
  expect(component.id).toBe('ab/A');
  expect(component.name).toBe('A');
});

// Modal
test('createModal', () => {
  const app = createModal({ A, B });

  expect(app).toBeInstanceOf(Modal);
});

// Stack
test('createStack', () => {
  const app = createStack({ A, B });

  expect(app).toBeInstanceOf(Stack);
});
