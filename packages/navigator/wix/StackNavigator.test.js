import { Navigation } from 'react-native-navigation';

import Component from './Component';
import StackNavigator from './StackNavigator';

let app;

const A = new Component('A');
const B = new Component('B');

const params = { foo: 'bar' };

beforeEach(() => {
  app = new StackNavigator(
    { A, B },
    { topBar: { title: 'foo' } },
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
      stack: {
        children: [
          {
            component: {
              id: 'A',
              name: 'A',
              options: { topBar: { backButton: { visible: false } } },
              passProps: {},
            },
          },
        ],
        options: { topBar: { title: 'foo' } },
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
      options: { topBar: { backButton: { visible: false } } },
    },
  });
});
