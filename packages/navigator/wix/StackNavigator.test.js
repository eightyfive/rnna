import { Navigation } from 'react-native-navigation';

import Component from './Component';
import { makeComponent } from './Component.test';
import StackNavigator from './StackNavigator';

export function makeStack(components, options = {}) {
  return {
    children: components.map(component => ({ component })),
    options,
  };
}

let app;

const A = new Component('A', { topBar: { title: { text: 'Title A' } } });
const B = new Component('B', { topBar: { title: { text: 'Title B' } } });
const C = new Component('C', { topBar: { title: { text: 'Title C' } } });

const params = { foo: 'bar' };

beforeEach(() => {
  app = new StackNavigator(
    { A, B, C },
    {},
    {
      screenOptions: { topBar: { backButton: { visible: false } } },
    },
  );

  app.mount();
});

test('mount', () => {
  expect(app.history).toEqual(['A']);

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([
        makeComponent('A', {
          topBar: {
            title: { text: 'Title A' },
            backButton: { visible: false },
          },
        }),
      ]),
    },
  });
});

test('push', () => {
  app.push('B', params, 'A');

  expect(app.history).toEqual(['A', 'B']);

  expect(Navigation.push).toHaveBeenCalledWith('A', {
    component: makeComponent(
      'B',
      {
        topBar: {
          title: { text: 'Title B' },
          backButton: { visible: false },
        },
      },
      params,
    ),
  });
});

test('popToRoot', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.popToRoot('C');

  expect(app.history).toEqual(['A']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('C');
});

test('navigate (push)', () => {
  app.push = jest.fn();
  app.navigate('B', params, 'A');

  expect(app.push).toHaveBeenCalledWith('B', params, 'A');
});

test('goBack', () => {
  app.navigate('B', params, 'A');
  app.navigate('C', params, 'B');
  app.goBack('C');

  expect(app.history).toEqual(['A', 'B']);
  expect(Navigation.pop).toHaveBeenCalledWith('C');
});
