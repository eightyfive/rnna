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

const props = { foo: 'bar' };

beforeEach(() => {
  app = new StackNavigator({ A, B, C }, {}, {});

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
          },
        }),
      ]),
    },
  });
});

test('push', () => {
  app.push('B', props, 'A');

  expect(app.history).toEqual(['A', 'B']);

  expect(Navigation.push).toHaveBeenCalledWith('A', {
    component: makeComponent(
      'B',
      {
        topBar: {
          title: { text: 'Title B' },
        },
      },
      props,
    ),
  });
});

test('popToRoot', () => {
  app.push('B', props, 'A');
  app.push('C', props, 'B');
  app.popToRoot('C');

  expect(app.history).toEqual(['A']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('C');
});

test('render (push)', () => {
  app.push = jest.fn();
  app.render('B', props);

  expect(app.push).toHaveBeenCalledWith('B', props);
});

test('goBack', () => {
  app.render('B', props);
  app.render('C', props);
  app.goBack('C');

  expect(app.history).toEqual(['A', 'B']);
  expect(Navigation.pop).toHaveBeenCalledWith('C');
});
