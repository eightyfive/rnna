import { Navigation } from 'react-native-navigation';

import { createStackNavigator } from './index';

let navigator;

const A = { componentId: 'A' };
const B = { componentId: 'B' };
const C = { componentId: 'C' };

const params = { foo: 'bar' };

beforeEach(() => {
  navigator = createStackNavigator(
    { A, B, C },
    { defaultOptions: { topBar: { title: 'foo' } } },
  );
  navigator.mount();
});

test('mount', () => {
  expect(navigator.history).toEqual(['A']);
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: {
        children: [
          {
            component: {
              id: 'A',
              name: 'A',
              options: { topBar: { title: 'foo' } },
            },
          },
        ],
      },
    },
  });
});

test('push', () => {
  navigator.push('B', params, 'A');

  expect(navigator.history).toEqual(['A', 'B']);
  expect(Navigation.push).toHaveBeenCalledWith('A', {
    component: {
      id: 'B',
      name: 'B',
      passProps: params,
      options: { topBar: { title: 'foo' } },
    },
  });
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
