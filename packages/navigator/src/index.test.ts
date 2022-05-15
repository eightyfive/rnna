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

// Bottom tabs
test('createBottomTabs', () => {
  const app = createBottomTabs({
    ab: createStack(['A', 'B']),
    cd: createStack(['C', 'D']),
  });

  app.mount();

  expect(app).toBeInstanceOf(BottomTabs);

  const stack = app.stacks[0];
  expect(stack).toBeInstanceOf(Stack);

  const component = Array.from(stack.components.values())[0];

  expect(component).toBeInstanceOf(Component);
  expect(component.id).toBe('A');
  expect(component.name).toBe('A');
});

// Modal
test('createModal', () => {
  const app = createModal(['A', 'B']);

  expect(app).toBeInstanceOf(Modal);
});

// Stack
test('createStack', () => {
  const app = createStack(['A', 'B']);

  expect(app).toBeInstanceOf(Stack);
});

// Overlay
test('createOverlay', () => {
  const app = createOverlay('A');

  expect(app).toBeInstanceOf(Overlay);
});
