import { FC } from 'react';

import { BottomTabs } from './BottomTabs';
import { Component } from './Component';
import { Modal } from './Modal';
import { Stack } from './Stack';
import {
  createBottomTabs,
  createModal,
  createOverlay,
  createStack,
} from './index';
import { Overlay } from './Overlay';

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

// Bottom tabs
test('createBottomTabs', () => {
  const app = createBottomTabs({
    ab: { A, B },
    cd: { C, D },
  });

  app.mount();

  expect(app).toBeInstanceOf(BottomTabs);

  const stack = app.stacks[0];
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

// Overlay
const Dialog: FC = () => null;

test('createOverlay', () => {
  const app = createOverlay('dialog1', 'Dialog', Dialog);

  expect(app).toBeInstanceOf(Overlay);
});
