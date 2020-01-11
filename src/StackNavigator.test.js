import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import Stack from './Layout/Stack';
import StackNavigator from './StackNavigator';

let stack;
let navigator;

const componentB = new Component('B');
const componentC = new Component('C');
const componentD = new Component('D');

const params = { foo: 'bar' };

beforeEach(() => {
  stack = new Stack('A', [componentB, componentC, componentD]);

  navigator = new StackNavigator('E', stack);

  navigator.mount();
});

test('mount', () => {
  const initialLayout = stack.getLayout('B');
  const initialComponentId = 'B';

  expect(navigator.initialComponentId).toBe(initialComponentId);
  expect(navigator.activeId).toBe(initialComponentId);
  expect(navigator.history).toEqual([initialComponentId]);
  expect(navigator.getInitialLayout()).toEqual(initialLayout);
  expect(Navigation.setRoot).toHaveBeenCalledWith({ root: initialLayout });
});

test('push', () => {
  navigator.push('C', params, 'B');

  expect(navigator.history).toEqual(['B', 'C']);
  expect(Navigation.push).toHaveBeenCalledWith(
    'B',
    componentC.getLayout(params),
  );
});

test('popToIndex', () => {
  navigator.push('C', params, 'B');
  navigator.push('D', params, 'C');
  navigator.popToIndex(0);

  expect(navigator.history).toEqual(['B']);
  expect(Navigation.popTo).toHaveBeenCalledWith('B');
});

test('pop 1', () => {
  navigator.push('C', params, 'B');
  navigator.push('D', params, 'C');
  navigator.pop();

  expect(navigator.history).toEqual(['B', 'C']);
  expect(Navigation.popTo).toHaveBeenCalledWith('C');
});

test('pop 2', () => {
  navigator.push('C', params, 'B');
  navigator.push('D', params, 'C');
  navigator.pop(2);

  expect(navigator.history).toEqual(['B']);
  expect(Navigation.popTo).toHaveBeenCalledWith('B');
});

test('popToTop', () => {
  navigator.push('C', params, 'B');
  navigator.push('D', params, 'C');
  navigator.popToTop('D');

  expect(navigator.history).toEqual(['B']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('D');
});

test('navigate (push)', () => {
  navigator.push = jest.fn();
  navigator.navigate('C', params, 'B');

  expect(navigator.push).toHaveBeenCalledWith('C', params, 'B');
});

test('navigate (popToIndex)', () => {
  navigator.popToIndex = jest.fn();

  navigator.navigate('C', params, 'B');
  navigator.navigate('D', params, 'C');
  navigator.navigate('C', params, 'D');

  expect(navigator.popToIndex).toHaveBeenCalledWith(1);
});

test('goBack', () => {
  navigator.navigate('C', params, 'B');
  navigator.navigate('D', params, 'C');
  navigator.goBack('D');

  expect(navigator.history).toEqual(['B', 'C']);
  expect(Navigation.pop).toHaveBeenCalledWith('D');
});
