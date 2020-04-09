import { Navigation } from 'react-native-navigation';

import createStackNavigator from './createStackNavigator';

let app;

const A = {};
const B = {};
const C = {};

const params = { foo: 'bar' };

beforeEach(() => {
  app = createStackNavigator(
    { A, B, C },
    { defaultOptions: { topBar: { title: 'foo' } } },
  );
  app.mount();
});

test('mount', () => {
  expect(app.history).toEqual(['A']);
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
  app.push('B', params, 'A');

  expect(app.history).toEqual(['A', 'B']);
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
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.popToIndex(0);

  expect(app.history).toEqual(['A']);
  expect(Navigation.popTo).toHaveBeenCalledWith('A');
});

test('pop 1', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.pop();

  expect(app.history).toEqual(['A', 'B']);
  expect(Navigation.popTo).toHaveBeenCalledWith('B');
});

test('pop 2', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.pop(2);

  expect(app.history).toEqual(['A']);
  expect(Navigation.popTo).toHaveBeenCalledWith('A');
});

test('popToTop', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.popToTop('C');

  expect(app.history).toEqual(['A']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('C');
});

test('navigate (push)', () => {
  app.push = jest.fn();
  app.navigate('B', params, 'A');

  expect(app.push).toHaveBeenCalledWith('B', params, 'A');
});

test('navigate (popToIndex)', () => {
  app.popToIndex = jest.fn();

  app.navigate('B', params, 'A');
  app.navigate('C', params, 'B');
  app.navigate('B', params, 'C');

  expect(app.popToIndex).toHaveBeenCalledWith(1);
});

test('goBack', () => {
  app.navigate('B', params, 'A');
  app.navigate('C', params, 'B');
  app.goBack('C');

  expect(app.history).toEqual(['A', 'B']);
  expect(Navigation.pop).toHaveBeenCalledWith('C');
});
