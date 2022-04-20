import RootNavigator from './RootNavigator';
import { BottomTabs, Component, Widget } from './Layouts';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import Stack from './Stack';
import {
  createBottomTabsNavigator,
  createModalNavigator,
  createRootNavigator,
  createStackNavigator,
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
test('createBottomTabsNavigator', () => {
  const app = createBottomTabsNavigator({
    ab: { A, B },
    cd: { C, D },
  });

  app.mount();

  expect(app).toBeInstanceOf(BottomTabsNavigator);

  const stack = app.getStackAt(0);
  expect(stack).toBeInstanceOf(Stack);

  const component = Array.from(stack.components.values())[0];

  expect(component).toBeInstanceOf(Component);
  expect(component.id).toBe('ab/A');
  expect(component.name).toBe('A');
});

// Modal
test('createModalNavigator', () => {
  const app = createModalNavigator({ A, B });

  expect(app).toBeInstanceOf(ModalNavigator);
});

// Stack
test('createStackNavigator', () => {
  const app = createStackNavigator({ A, B });

  expect(app).toBeInstanceOf(Stack);
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

  app.mount('abcd');
  expect(app.navigator).toBeInstanceOf(BottomTabs);

  app.mount('ef');
  expect(app.navigator).toBeInstanceOf(Stack);

  app.showModal('gh');
  expect(app.navigator).toBeInstanceOf(ModalNavigator);

  app.dismissModal('gh');
  // ef...
  expect(app.navigator).toBeInstanceOf(Stack);

  // TODO
  // app.showOverlay('C');
});
