import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import Stack from './Layout/Stack';
import StackNavigator from './StackNavigator';

let navigator;

const componentA = new Component('A');
const componentB = new Component('B');
const componentC = new Component('C');

const stack = new Stack('stack', [componentA, componentB, componentC]);

const params = { foo: 'bar' };

beforeEach(() => {
  navigator = new StackNavigator('STACK', stack);
  navigator.mount();
});

test('mount', () => {
  const initialLayout = stack.getLayout('A');
  const initialComponentId = 'A';

  expect(navigator.initialComponentId).toBe(initialComponentId);
  expect(navigator.activeId).toBe(initialComponentId);
  expect(navigator.history).toEqual([initialComponentId]);
  expect(navigator.getInitialLayout()).toEqual(initialLayout);
  expect(Navigation.setRoot).toHaveBeenCalledWith({ root: initialLayout });
});

test('push', () => {
  navigator.push('B', params, 'A');

  expect(navigator.history).toEqual(['A', 'B']);
  expect(Navigation.push).toHaveBeenCalledWith(
    'A',
    componentB.getLayout(params),
  );
});

test('popToIndex', () => {
  navigator.push('B', params, 'A');
  navigator.push('C', params, 'B');
  navigator.popToIndex(0);

  expect(navigator.history).toEqual(['A']);
  expect(Navigation.popTo).toHaveBeenCalledWith('A');
});

test('pop 1', () => {
  navigator.push('B', params, 'A');
  navigator.push('C', params, 'B');
  navigator.pop();

  expect(navigator.history).toEqual(['A', 'B']);
  expect(Navigation.popTo).toHaveBeenCalledWith('B');
});

test('pop 2', () => {
  navigator.push('B', params, 'A');
  navigator.push('C', params, 'B');
  navigator.pop(2);

  expect(navigator.history).toEqual(['A']);
  expect(Navigation.popTo).toHaveBeenCalledWith('A');
});

test('popToTop', () => {
  navigator.push('B', params, 'A');
  navigator.push('C', params, 'B');
  navigator.popToTop('C');

  expect(navigator.history).toEqual(['A']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('C');
});

test('navigate (push)', () => {
  navigator.push = jest.fn();
  navigator.navigate('B', params, 'A');

  expect(navigator.push).toHaveBeenCalledWith('B', params, 'A');
});

test('navigate (popToIndex)', () => {
  navigator.popToIndex = jest.fn();

  navigator.navigate('B', params, 'A');
  navigator.navigate('C', params, 'B');
  navigator.navigate('B', params, 'C');

  expect(navigator.popToIndex).toHaveBeenCalledWith(1);
});

test('goBack', () => {
  navigator.navigate('B', params, 'A');
  navigator.navigate('C', params, 'B');
  navigator.goBack('C');

  expect(navigator.history).toEqual(['A', 'B']);
  expect(Navigation.pop).toHaveBeenCalledWith('C');
});
