import { Navigation } from 'react-native-navigation';

import Component from './Component';
import { makeComponent } from './Component.test';
import Stack from './Stack';

export function makeStack(components, options = {}) {
  return {
    children: components.map(component => ({ component })),
    options,
  };
}

function createStack() {
  const A = new Component('a', 'A', { topBar: { title: { text: 'Title A' } } });
  const B = new Component('b', 'B', { topBar: { title: { text: 'Title B' } } });
  const C = new Component('c', 'C', { topBar: { title: { text: 'Title C' } } });

  return new Stack({ A, B, C });
}

let app;

const props = { foo: 'bar' };

beforeEach(() => {
  app = createStack();
  app.mount();
});

test('access properties', () => {
  expect(app.A).toBeDefined();
  expect(app.B).toBeDefined();
  expect(app.C).toBeDefined();

  expect(app.A.id).toBe('a');
  expect(app.A.name).toBe('A');

  expect(app.B.id).toBe('b');
  expect(app.B.name).toBe('B');

  expect(app.C.id).toBe('c');
  expect(app.C.name).toBe('C');

  expect(Navigation.push).not.toHaveBeenCalled();
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([
        makeComponent('a', 'A', {
          topBar: {
            title: { text: 'Title A' },
          },
        }),
      ]),
    },
  });
});

test('mount', () => {
  expect(app.history).toEqual(['A']);

  expect(Navigation.push).not.toHaveBeenCalled();
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([
        makeComponent('a', 'A', {
          topBar: {
            title: { text: 'Title A' },
          },
        }),
      ]),
    },
  });
});

test('push', () => {
  app.push('B', props);

  expect(app.history).toEqual(['A', 'B']);

  expect(Navigation.push).toHaveBeenCalledWith('a', {
    component: makeComponent(
      'b',
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

test('pop', () => {
  app.push('B', props);
  app.push('C', props);
  app.pop();

  expect(app.history).toEqual(['A', 'B']);
  expect(Navigation.pop).toHaveBeenCalledWith('c');
});

test('popToRoot', () => {
  app.push('B', props);
  app.push('C', props);
  app.popToRoot();

  expect(app.history).toEqual(['A']);
  expect(Navigation.popToRoot).toHaveBeenCalledWith('c');
});
